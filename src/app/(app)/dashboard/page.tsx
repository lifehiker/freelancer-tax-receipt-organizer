import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { calculateQuarterlyEstimate } from "@/lib/tax/calculateQuarterlyEstimate";
import { formatCents } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type { FilingStatus } from "@/lib/tax/config/2024";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;
  const [taxProfile, incomeEntries, expenses] = await Promise.all([
    prisma.taxProfile.findUnique({ where: { userId } }),
    prisma.incomeEntry.findMany({ where: { userId }, orderBy: { receivedAt: "desc" }, take: 5 }),
    prisma.expenseEntry.findMany({ where: { userId }, orderBy: { spentAt: "desc" }, take: 5 }),
  ]);

  let estimates = null;
  if (taxProfile) {
    estimates = calculateQuarterlyEstimate({
      expectedAnnualIncome: taxProfile.expectedAnnualIncomeCents / 100,
      filingStatus: taxProfile.filingStatus as FilingStatus,
      deductions: taxProfile.deductionsEstimateCents / 100,
      priorPayments: taxProfile.priorPaymentsCents / 100,
    });
  }

  const totalIncome = incomeEntries.reduce((sum, e) => sum + e.amountCents, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amountCents, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">Your tax estimate overview for {taxProfile?.taxYear || 2024}</p>
      </div>

      {!taxProfile && (
        <div className="rounded-lg bg-teal-50 border border-teal-200 p-6">
          <h3 className="font-semibold text-teal-900 mb-2">Set up your tax profile to see estimates</h3>
          <p className="text-teal-800 text-sm mb-4">Tell us your filing status and expected income to see your quarterly tax estimate.</p>
          <Link href="/onboarding" className="inline-flex items-center justify-center rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800">Set Up Tax Profile</Link>
        </div>
      )}

      {estimates && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-500">Annual Tax Estimate</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold text-slate-900">{formatCents(Math.round(estimates.totalAnnualTax * 100))}</p><p className="text-xs text-slate-500 mt-1">Federal + SE tax</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-500">Quarterly Payment</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold text-teal-700">{formatCents(Math.round(estimates.quarterlyPayment * 100))}</p><p className="text-xs text-slate-500 mt-1">Estimated per quarter</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-500">Set Aside Rate</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold text-slate-900">{estimates.setAsidePercent}%</p><p className="text-xs text-slate-500 mt-1">Of each payment</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-500">Next Due Date</CardTitle></CardHeader>
            <CardContent><p className="text-xl font-bold text-orange-600">{estimates.nextDueDate}</p><p className="text-xs text-slate-500 mt-1">Q{estimates.nextQuarter} payment</p></CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Recent Income</h2>
            <Link href="/income" className="text-sm text-teal-700 hover:underline">View all</Link>
          </div>
          {incomeEntries.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
              <p className="text-slate-500 mb-4">No income entries yet</p>
              <Link href="/income" className="inline-flex items-center justify-center rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800">Add Income</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {incomeEntries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4">
                  <div><p className="font-medium text-slate-900">{entry.source}</p><p className="text-sm text-slate-500">{new Date(entry.receivedAt).toLocaleDateString()}</p></div>
                  <span className="font-semibold text-teal-700">{formatCents(entry.amountCents)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Recent Expenses</h2>
            <Link href="/expenses" className="text-sm text-teal-700 hover:underline">View all</Link>
          </div>
          {expenses.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
              <p className="text-slate-500 mb-4">No expense entries yet</p>
              <Link href="/expenses" className="inline-flex items-center justify-center rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800">Add Expense</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {expenses.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4">
                  <div><p className="font-medium text-slate-900">{entry.vendor}</p><p className="text-sm text-slate-500">{entry.category} - {new Date(entry.spentAt).toLocaleDateString()}</p></div>
                  <span className="font-semibold text-red-600">-{formatCents(entry.amountCents)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-lg bg-slate-100 border border-slate-200 p-4 text-xs text-slate-500">
        Disclaimer: Tax estimates are for informational purposes only and based on the information you provided. This is not tax advice. Consult a qualified tax professional for personalized guidance.
      </div>
    </div>
  );
}
