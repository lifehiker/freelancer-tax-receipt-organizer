import { TAX_CONFIG_2024, FilingStatus } from "./config/2024";

function getBrackets(filingStatus: FilingStatus) {
  if (filingStatus === "marriedFilingSeparately") {
    return TAX_CONFIG_2024.brackets.single;
  }
  return TAX_CONFIG_2024.brackets[filingStatus] ?? TAX_CONFIG_2024.brackets.single;
}

function getStandardDeduction(filingStatus: FilingStatus): number {
  return TAX_CONFIG_2024.standardDeduction[filingStatus] ?? TAX_CONFIG_2024.standardDeduction.single;
}

export function calculateFederalEstimate(params: {
  grossIncome: number;
  filingStatus: FilingStatus;
  deductions?: number;
  seDeduction?: number;
}): {
  federalTax: number;
  taxableIncome: number;
  effectiveRate: number;
} {
  const { grossIncome, filingStatus, deductions = 0, seDeduction = 0 } = params;

  const standardDeduction = getStandardDeduction(filingStatus);
  const totalDeductions = Math.max(standardDeduction, deductions) + seDeduction;
  const taxableIncome = Math.max(0, grossIncome - totalDeductions);

  const brackets = getBrackets(filingStatus);
  let federalTax = 0;

  for (const bracket of brackets) {
    if (taxableIncome <= bracket.min) break;
    const taxable = Math.min(taxableIncome, bracket.max) - bracket.min;
    federalTax += taxable * bracket.rate;
  }

  const effectiveRate = grossIncome > 0 ? federalTax / grossIncome : 0;

  return { federalTax, taxableIncome, effectiveRate };
}
