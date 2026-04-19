import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IncomeForm } from "@/components/income/income-form";
import { DeleteButton } from "@/components/shared/delete-button";

export default async function IncomePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const entries = await prisma.incomeEntry.findMany({
    where: { userId: session.user.id },
    orderBy: { receivedAt: "desc" },
  });

  const totalCents = entries.reduce((sum, e) => sum + e.amountCents, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Income</h1>
        <p className="text-slate-600 mt-1">Track all your 1099 income sources</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-500">Total Income</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold text-slate-900">{formatCents(totalCents)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-500">Entries</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold text-slate-900">{entries.length}</p></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Add Income</CardTitle></CardHeader>
        <CardContent><IncomeForm /></CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">All Income Entries</h2>
        {entries.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
            <p className="text-slate-500">No income entries yet. Add your first income entry above.</p>
          </div>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Source</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Category</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Date</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-500">Amount</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{entry.source}</td>
                    <td className="px-4 py-3 text-slate-500 capitalize">{entry.category}</td>
                    <td className="px-4 py-3 text-slate-500">{new Date(entry.receivedAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right font-semibold text-teal-700">{formatCents(entry.amountCents)}</td>
                    <td className="px-4 py-3 text-right">
                      <DeleteButton id={entry.id} endpoint="/api/income" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
