import { z } from "zod";

export const incomeSchema = z.object({
  source: z.string().min(1, "Source is required"),
  amountCents: z.number().int().positive("Amount must be positive"),
  receivedAt: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
  category: z.string().default("freelance"),
});

export type IncomeFormData = z.infer<typeof incomeSchema>;
