import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  if (!process.env.STRIPE_WEBHOOK_SECRET || !process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ ok: true });
  }

  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-02-24.acacia" });

  const body = await req.text();
  const signature = req.headers.get("stripe-signature") ?? "";

  let event: import("stripe").Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Webhook signature verification failed: " + message },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const cs = event.data.object as import("stripe").Stripe.Checkout.Session;
        const email = cs.customer_email ?? cs.customer_details?.email;
        const userId = cs.metadata?.userId;
        const plan = cs.metadata?.plan ?? "solo_monthly";

        if (!userId && !email) break;

        const user = userId
          ? await prisma.user.findUnique({ where: { id: userId } })
          : email
          ? await prisma.user.findUnique({ where: { email } })
          : null;

        if (!user) break;

        const stripeCustomerId =
          typeof cs.customer === "string" ? cs.customer : (cs.customer as { id?: string } | null)?.id ?? null;
        const stripeSubscriptionId =
          typeof cs.subscription === "string"
            ? cs.subscription
            : (cs.subscription as { id?: string } | null)?.id ?? null;

        await prisma.subscription.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            stripeCustomerId: stripeCustomerId ?? undefined,
            stripeSubscriptionId: stripeSubscriptionId ?? undefined,
            plan,
            status: "active",
          },
          update: {
            stripeCustomerId: stripeCustomerId ?? undefined,
            stripeSubscriptionId: stripeSubscriptionId ?? undefined,
            plan,
            status: "active",
          },
        });
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as import("stripe").Stripe.Subscription;
        const status =
          sub.status === "active" ? "active" : sub.status === "canceled" ? "canceled" : "inactive";
        const currentPeriodEnd = new Date(sub.current_period_end * 1000);
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: sub.id },
          data: { status, currentPeriodEnd },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as import("stripe").Stripe.Subscription;
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: sub.id },
          data: { status: "canceled", plan: "free" },
        });
        break;
      }

      default:
        break;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[stripe-webhook] Error:", event.type, message);
    return NextResponse.json({ error: "Internal error processing webhook" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
