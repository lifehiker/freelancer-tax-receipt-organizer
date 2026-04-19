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

const schema = z.object({
  source: z.string().min(1, "Source required"),
  amount: z.coerce.number().positive(),
  receivedAt: z.string().min(1),
  category: z.string().default("freelance"),
  notes: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export function IncomeForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { category: "freelance", receivedAt: new Date().toISOString().split("T")[0] },
  });

  async function onSubmit(data: FormData) {
    setLoading(true);
    try {
      const res = await fetch("/api/income", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, amountCents: Math.round(data.amount * 100) }),
      });
      if (!res.ok) throw new Error();
      toast({ title: "Income added", description: "Income recorded successfully." });
      reset();
      onSuccess?.();
      router.refresh();
    } catch {
      toast({ title: "Error", description: "Failed to save income.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Source / Client</Label>
          <Input placeholder="Acme Corp" {...register("source")} />
          {errors.source && <p className="text-sm text-red-500">{errors.source.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>Amount (USD)</Label>
          <Input type="number" step="0.01" min="0" placeholder="1500.00" {...register("amount")} />
        </div>
        <div className="space-y-2">
          <Label>Date Received</Label>
          <Input type="date" {...register("receivedAt")} />
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <Select {...register("category")}>
            <option value="freelance">Freelance</option>
            <option value="consulting">Consulting</option>
            <option value="contract">Contract</option>
            <option value="rental">Rental</option>
            <option value="gig">Gig Work</option>
            <option value="other">Other</option>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Notes (optional)</Label>
        <Textarea placeholder="Invoice details..." {...register("notes")} />
      </div>
      <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Add Income"}</Button>
    </form>
  );
}
