import Link from "next/link";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReceiptEditForm } from "@/components/receipts/receipt-edit-form";

interface ReceiptDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ReceiptDetailPage({ params }: ReceiptDetailPageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  const receipt = await prisma.receipt.findUnique({
    where: { id },
    include: { expenses: true },
  });

  if (!receipt || receipt.userId !== session.user.id) {
    notFound();
  }

  const isImage = receipt.mimeType.startsWith("image/");

  const expenseParams = new URLSearchParams({
    vendor: receipt.vendor ?? "",
    amount: receipt.totalCents != null ? (receipt.totalCents / 100).toFixed(2) : "",
    receiptId: receipt.id,
  });

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <Link
          href="/receipts"
          className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
        >
          &larr; Back to Receipts
        </Link>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 break-all">{receipt.fileName}</h1>
          <p className="text-slate-600 mt-1">
            Uploaded {new Date(receipt.createdAt).toLocaleDateString()}
          </p>
        </div>
        <Badge variant={receipt.ocrStatus === "done" ? "success" : "secondary"}>
          {receipt.ocrStatus}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Receipt Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {isImage ? (
              <div className="relative w-full rounded-md overflow-hidden bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/receipts/${receipt.id}/file`}
                  alt={receipt.fileName}
                  className="w-full h-auto object-contain"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 bg-slate-50 rounded-md border border-slate-200">
                <svg
                  className="w-12 h-12 text-slate-400 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-sm text-slate-500">PDF Document</p>
                <a
                  href={`/api/receipts/${receipt.id}/file`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 text-sm text-slate-700 underline hover:text-slate-900"
                >
                  Open PDF
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent>
              {receipt.totalCents != null && (
                <p className="text-2xl font-bold text-slate-900 mb-4">
                  {formatCents(receipt.totalCents)}
                </p>
              )}
              <ReceiptEditForm
                receipt={{
                  id: receipt.id,
                  vendor: receipt.vendor,
                  totalCents: receipt.totalCents,
                  receiptDate: receipt.receiptDate?.toISOString() ?? null,
                  ocrStatus: receipt.ocrStatus,
                }}
              />
            </CardContent>
          </Card>

          <Link
            href={`/expenses/new?${expenseParams.toString()}`}
            className="block w-full text-center rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Create Expense from Receipt
          </Link>
        </div>
      </div>

      {receipt.expenses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Linked Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {receipt.expenses.map((expense) => (
                <li key={expense.id} className="flex justify-between text-sm">
                  <span className="text-slate-700">{expense.vendor}</span>
                  <span className="text-slate-500">{formatCents(expense.amountCents)}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
