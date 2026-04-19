import { NextResponse } from "next/server";
import { auth } from "@/auth";

const PLANS: Record<string, { priceEnvVar: string }> = {
  solo_monthly: { priceEnvVar: "STRIPE_PRICE_SOLO_MONTHLY" },
  solo_yearly: { priceEnvVar: "STRIPE_PRICE_SOLO_YEARLY" },
  pro_yearly: { priceEnvVar: "STRIPE_PRICE_PRO_YEARLY" },
};

export async function GET(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const planKey = url.searchParams.get("plan") ?? "";
  const planConfig = PLANS[planKey];

  if (!planConfig) {
    return NextResponse.json(
      { error: "Invalid plan. Valid plans: " + Object.keys(PLANS).join(", ") },
      { status: 400 }
    );
  }

  const priceId = process.env[planConfig.priceEnvVar];
  if (!priceId) {
    return NextResponse.json(
      { error: "Price ID not configured for plan: " + planKey },
      { status: 503 }
    );
  }

  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-02-24.acacia" });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: session.user.email ?? undefined,
    metadata: {
      userId: session.user.id,
      plan: planKey,
    },
    success_url: appUrl + "/billing?success=1",
    cancel_url: appUrl + "/billing",
  });

  if (!checkoutSession.url) {
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }

  return NextResponse.redirect(checkoutSession.url);
}
