import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function BillingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const subscription = await prisma.subscription.findUnique({ where: { userId: session.user.id } });
  const plan = subscription?.plan || "free";
  const status = subscription?.status || "active";
  return (
    <div className="space-y-8">
      <div><h1 className="text-2xl font-bold text-slate-900">Billing</h1><p className="text-slate-600 mt-1">Manage your subscription plan</p></div>
      <Card>
        <CardHeader><CardTitle>Current Plan</CardTitle><CardDescription>Status: {status}</CardDescription></CardHeader>
        <CardContent>
          {plan === "free" && (
            <div className="space-y-4">
              <p className="text-slate-600 text-sm">Upgrade to access unlimited records, exports, and quarterly reminders.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border border-teal-200 bg-teal-50 p-4">
                  <h3 className="font-semibold text-teal-900 mb-2">Solo - 12/month</h3>
                  <a href="/api/stripe/checkout?plan=solo_monthly" className="block w-full text-center rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white">Upgrade to Solo</a>
                </div>
                <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
                  <h3 className="font-semibold text-purple-900 mb-2">Pro - 149/year</h3>
                  <a href="/api/stripe/checkout?plan=pro_yearly" className="block w-full text-center rounded-md bg-purple-700 px-4 py-2 text-sm font-medium text-white">Upgrade to Pro</a>
                </div>
              </div>
            </div>
          )}
          {plan !== "free" && <p className="text-slate-600 text-sm">You are on the {plan} plan. Thank you for your support!</p>}
        </CardContent>
      </Card>
    </div>
  );
}
