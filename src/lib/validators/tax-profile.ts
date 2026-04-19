import { z } from "zod";

export const taxProfileSchema = z.object({
  filingStatus: z.enum([
    "single",
    "marriedFilingJointly",
    "marriedFilingSeparately",
    "headOfHousehold",
  ]),
  stateCode: z.string().length(2, "State must be 2 characters"),
  expectedAnnualIncomeCents: z.number().int().min(0),
  deductionsEstimateCents: z.number().int().min(0),
  taxYear: z.number().int().min(2020).max(2030),
  priorPaymentsCents: z.number().int().min(0),
});

export type TaxProfileFormData = z.infer<typeof taxProfileSchema>;
