"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { EXPENSE_CATEGORIES } from "@/lib/validators/expense";

const schema = z.object({
  vendor: z.string().min(1, "Vendor required"),
  category: z.string().min(1),
  amount: z.coerce.number().positive(),
  spentAt: z.string().min(1),
  notes: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

function fmtCat(cat: string) {
  return cat.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase());
}

export function ExpenseForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { category: "office_expense", spentAt: new Date().toISOString().split("T")[0] },
  });

  async function onSubmit(data: FormData) {
    setLoading(true);
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, amountCents: Math.round(data.amount * 100) }),
      });
      if (!res.ok) throw new Error();
      toast({ title: "Expense added", description: "Expense recorded successfully." });
      reset();
      onSuccess?.();
      router.refresh();
    } catch {
      toast({ title: "Error", description: "Failed to save expense.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Vendor / Merchant</Label>
          <Input placeholder="Adobe, AWS..." {...register("vendor")} />
        </div>
        <div className="space-y-2">
          <Label>Amount (USD)</Label>
          <Input type="number" step="0.01" min="0" placeholder="49.99" {...register("amount")} />
        </div>
        <div className="space-y-2">
          <Label>Date</Label>
          <Input type="date" {...register("spentAt")} />
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <Select {...register("category")}>
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{fmtCat(cat)}</option>
            ))}
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Notes (optional)</Label>
        <Textarea placeholder="Details about this expense..." {...register("notes")} />
      </div>
      <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Add Expense"}</Button>
    </form>
  );
}
