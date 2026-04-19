export const TAX_CONFIG_2024 = {
  year: 2024,
  seRate: 0.1530,
  seDeductionRate: 0.5,
  standardDeduction: {
    single: 14600,
    marriedFilingJointly: 29200,
    marriedFilingSeparately: 14600,
    headOfHousehold: 21900,
  },
  brackets: {
    single: [
      { min: 0, max: 11600, rate: 0.10 },
      { min: 11600, max: 47150, rate: 0.12 },
      { min: 47150, max: 100525, rate: 0.22 },
      { min: 100525, max: 191950, rate: 0.24 },
      { min: 191950, max: 243725, rate: 0.32 },
      { min: 243725, max: 609350, rate: 0.35 },
      { min: 609350, max: Infinity, rate: 0.37 },
    ],
    marriedFilingJointly: [
      { min: 0, max: 23200, rate: 0.10 },
      { min: 23200, max: 94300, rate: 0.12 },
      { min: 94300, max: 201050, rate: 0.22 },
      { min: 201050, max: 383900, rate: 0.24 },
      { min: 383900, max: 487450, rate: 0.32 },
      { min: 487450, max: 731200, rate: 0.35 },
      { min: 731200, max: Infinity, rate: 0.37 },
    ],
    headOfHousehold: [
      { min: 0, max: 16550, rate: 0.10 },
      { min: 16550, max: 63100, rate: 0.12 },
      { min: 63100, max: 100500, rate: 0.22 },
      { min: 100500, max: 191950, rate: 0.24 },
      { min: 191950, max: 243700, rate: 0.32 },
      { min: 243700, max: 609350, rate: 0.35 },
      { min: 609350, max: Infinity, rate: 0.37 },
    ],
  },
  quarterlyDueDates: [
    { quarter: 1, label: "Q1", dueDate: "2024-04-15" },
    { quarter: 2, label: "Q2", dueDate: "2024-06-17" },
    { quarter: 3, label: "Q3", dueDate: "2024-09-16" },
    { quarter: 4, label: "Q4", dueDate: "2025-01-15" },
  ],
} as const;

export type FilingStatus = "single" | "marriedFilingJointly" | "marriedFilingSeparately" | "headOfHousehold";
