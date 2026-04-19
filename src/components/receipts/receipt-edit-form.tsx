"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";

interface ReceiptEditFormProps {
  receipt: {
    id: string;
    vendor: string | null;
    totalCents: number | null;
    receiptDate: string | null;
    ocrStatus: string;
  };
}

export function ReceiptEditForm({ receipt }: ReceiptEditFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const [vendor, setVendor] = useState(receipt.vendor ?? "");
  const [amount, setAmount] = useState(
    receipt.totalCents != null ? (receipt.totalCents / 100).toFixed(2) : ""
  );
  const [receiptDate, setReceiptDate] = useState(
    receipt.receiptDate ? new Date(receipt.receiptDate).toISOString().split("T")[0] : ""
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSaving(true);

    try {
      const totalCents = amount ? Math.round(parseFloat(amount) * 100) : undefined;

      const res = await fetch(`/api/receipts/${receipt.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendor: vendor || undefined,
          totalCents,
          receiptDate: receiptDate || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error ?? "Save failed");
      }

      toast({ title: "Receipt updated" });
      router.refresh();
    } catch (err) {
      toast({
        title: "Save failed",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="vendor" className="block text-sm font-medium text-slate-700 mb-1">
          Vendor
        </label>
        <input
          id="vendor"
          type="text"
          value={vendor}
          onChange={(e) => setVendor(e.target.value)}
          placeholder="e.g. Office Depot"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
        />
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-1">
          Amount ($)
        </label>
        <input
          id="amount"
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
        />
      </div>

      <div>
        <label htmlFor="receiptDate" className="block text-sm font-medium text-slate-700 mb-1">
          Receipt Date
        </label>
        <input
          id="receiptDate"
          type="date"
          value={receiptDate}
          onChange={(e) => setReceiptDate(e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
        />
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSaving ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
