import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";

export default async function ExportsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });
  const isPaid = subscription?.plan !== "free" && subscription?.status === "active";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Export Records</h1>
        <p className="text-slate-600 mt-1">Download your income, expenses, and deductions as CSV or PDF</p>
      </div>
      {!isPaid && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-6">
          <h3 className="font-semibold text-amber-900 mb-2">Exports require a Solo or Pro plan</h3>
          <p className="text-amber-800 text-sm mb-4">Upgrade to download your records in CSV or PDF format.</p>
          <Link href="/billing" className="inline-flex items-center justify-center rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800">Upgrade Plan</Link>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Income CSV</CardTitle><CardDescription>All income entries with source, date, amount, and category</CardDescription></CardHeader>
          <CardContent>{isPaid ? <a href="/api/exports/csv?type=income" className="inline-flex items-center justify-center rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800">Download CSV</a> : <span className="text-sm text-slate-500">Upgrade required</span>}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Expenses CSV</CardTitle><CardDescription>All expense entries with vendor, category, date, and amount</CardDescription></CardHeader>
          <CardContent>{isPaid ? <a href="/api/exports/csv?type=expenses" className="inline-flex items-center justify-center rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800">Download CSV</a> : <span className="text-sm text-slate-500">Upgrade required</span>}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Combined Ledger CSV</CardTitle><CardDescription>Full income and expense ledger in one file</CardDescription></CardHeader>
          <CardContent>{isPaid ? <a href="/api/exports/csv?type=combined" className="inline-flex items-center justify-center rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800">Download CSV</a> : <span className="text-sm text-slate-500">Upgrade required</span>}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Annual PDF Summary</CardTitle><CardDescription>Year-end summary with income, expenses, and estimated taxes</CardDescription></CardHeader>
          <CardContent>{isPaid ? <a href="/api/exports/pdf" className="inline-flex items-center justify-center rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800">Download PDF</a> : <span className="text-sm text-slate-500">Upgrade required</span>}</CardContent>
        </Card>
      </div>
    </div>
  );
}
