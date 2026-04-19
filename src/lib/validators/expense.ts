import { z } from "zod";

export const EXPENSE_CATEGORIES = [
  "advertising",
  "auto_and_travel",
  "commissions_and_fees",
  "contract_labor",
  "depletion",
  "depreciation",
  "employee_benefits",
  "insurance",
  "interest_mortgage",
  "interest_other",
  "legal_and_professional",
  "office_expense",
  "pension_plans",
  "rent_or_lease_vehicles",
  "rent_or_lease_other",
  "repairs_and_maintenance",
  "supplies",
  "taxes_and_licenses",
  "travel",
  "utilities",
  "wages",
  "other",
] as const;

export const expenseSchema = z.object({
  vendor: z.string().min(1, "Vendor is required"),
  category: z.string().min(1, "Category is required"),
  amountCents: z.number().int().positive("Amount must be positive"),
  spentAt: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
  receiptId: z.string().optional(),
});

export type ExpenseFormData = z.infer<typeof expenseSchema>;
