import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReceiptUploadForm } from "@/components/receipts/receipt-upload-form";

export default async function ReceiptsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const receipts = await prisma.receipt.findMany({
    where: { userId: session.user.id },
    include: { expenses: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Receipts</h1>
        <p className="text-slate-600 mt-1">Upload and organize your business receipts</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Receipt</CardTitle>
        </CardHeader>
        <CardContent>
          <ReceiptUploadForm />
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">All Receipts</h2>
        {receipts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
            <p className="text-slate-500">No receipts uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {receipts.map((receipt) => (
              <Link
                key={receipt.id}
                href={`/receipts/${receipt.id}`}
                className="block rounded-lg border border-slate-200 bg-white p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="min-w-0 flex-1 mr-2">
                    <p className="font-medium text-slate-900 truncate">{receipt.fileName}</p>
                    <p className="text-sm text-slate-500">{receipt.vendor ?? "No vendor"}</p>
                  </div>
                  <Badge variant={receipt.ocrStatus === "done" ? "success" : "secondary"}>
                    {receipt.ocrStatus}
                  </Badge>
                </div>
                {receipt.totalCents != null && (
                  <p className="text-lg font-semibold text-slate-900">
                    {formatCents(receipt.totalCents)}
                  </p>
                )}
                {receipt.receiptDate && (
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(receipt.receiptDate).toLocaleDateString()}
                  </p>
                )}
                <p className="text-xs text-slate-400 mt-1">
                  Added {new Date(receipt.createdAt).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
