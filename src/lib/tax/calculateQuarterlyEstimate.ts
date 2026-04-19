import { TAX_CONFIG_2024 } from "./config/2024";
import { FilingStatus } from "./config/2024";
import { calculateSelfEmploymentTax } from "./calculateSelfEmploymentTax";
import { calculateFederalEstimate } from "./calculateFederalEstimate";

export function calculateQuarterlyEstimate(params: {
  expectedAnnualIncome: number;
  filingStatus: FilingStatus;
  deductions?: number;
  priorPayments?: number;
}): {
  seTax: number;
  federalTax: number;
  totalAnnualTax: number;
  quarterlyPayment: number;
  setAsidePercent: number;
  nextDueDate: string;
  nextQuarter: number;
} {
  const { expectedAnnualIncome, filingStatus, deductions = 0, priorPayments = 0 } = params;

  const { seTax, seDeduction } = calculateSelfEmploymentTax(expectedAnnualIncome);
  const { federalTax } = calculateFederalEstimate({
    grossIncome: expectedAnnualIncome,
    filingStatus,
    deductions,
    seDeduction,
  });

  const totalAnnualTax = seTax + federalTax - priorPayments;
  const remainingTax = Math.max(0, totalAnnualTax);
  const quarterlyPayment = remainingTax / 4;

  const setAsidePercent = expectedAnnualIncome > 0
    ? Math.round((totalAnnualTax / expectedAnnualIncome) * 100)
    : 25;

  const today = new Date();
  const year = today.getFullYear();
  const dueDates = TAX_CONFIG_2024.quarterlyDueDates;
  let nextDueDate = dueDates[dueDates.length - 1].dueDate;
  let nextQuarter = dueDates[dueDates.length - 1].quarter;

  for (const dd of dueDates) {
    const due = new Date(dd.dueDate);
    if (today <= due) {
      nextDueDate = dd.dueDate;
      nextQuarter = dd.quarter;
      break;
    }
  }

  return {
    seTax,
    federalTax,
    totalAnnualTax,
    quarterlyPayment,
    setAsidePercent,
    nextDueDate,
    nextQuarter,
  };
}
