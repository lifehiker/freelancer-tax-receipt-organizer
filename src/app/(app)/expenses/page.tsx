import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExpenseForm } from "@/components/expenses/expense-form";
import { DeleteButton } from "@/components/shared/delete-button";

export default async function ExpensesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const entries = await prisma.expenseEntry.findMany({
    where: { userId: session.user.id },
    orderBy: { spentAt: "desc" },
  });

  const totalCents = entries.reduce((sum, e) => sum + e.amountCents, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Expenses</h1>
        <p className="text-slate-600 mt-1">Track deductible business expenses</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-500">Total Expenses</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold text-red-600">{formatCents(totalCents)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-500">Entries</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold text-slate-900">{entries.length}</p></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Add Expense</CardTitle></CardHeader>
        <CardContent><ExpenseForm /></CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">All Expenses</h2>
        {entries.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
            <p className="text-slate-500">No expense entries yet. Add your first expense above.</p>
          </div>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Vendor</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Category</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Date</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-500">Amount</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{entry.vendor}</td>
                    <td className="px-4 py-3 text-slate-500 capitalize">{entry.category.replace(/_/g, " ")}</td>
                    <td className="px-4 py-3 text-slate-500">{new Date(entry.spentAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right font-semibold text-red-600">{formatCents(entry.amountCents)}</td>
                    <td className="px-4 py-3 text-right">
                      <DeleteButton id={entry.id} endpoint="/api/expenses" />
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
