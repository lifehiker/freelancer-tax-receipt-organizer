import { TAX_CONFIG_2024 } from "./config/2024";

export function calculateSelfEmploymentTax(netSelfEmploymentIncome: number): {
  seTax: number;
  seDeduction: number;
} {
  if (netSelfEmploymentIncome <= 0) return { seTax: 0, seDeduction: 0 };
  const seTax = netSelfEmploymentIncome * TAX_CONFIG_2024.seRate;
  const seDeduction = seTax * TAX_CONFIG_2024.seDeductionRate;
  return { seTax, seDeduction };
}
