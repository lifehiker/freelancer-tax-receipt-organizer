import type { Metadata } from "next";
import { TaxCalculatorForm } from "@/components/calculator/tax-calculator-form";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Self-Employed Tax Calculator - Free 1099 Estimator | FreelanceTaxKit",
  description: "Calculate your self-employment tax and federal income tax for free.",
};

export default function SelfEmployedTaxCalculatorPage() {
  return (
    <div className="py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Self-Employed Tax Calculator</h1>
          <p className="text-xl text-slate-600">Estimate your federal income tax and self-employment tax for 2024. Free, no signup required.</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 mb-8">
          <TaxCalculatorForm />
        </div>
        <div className="mt-8 rounded-lg bg-teal-50 border border-teal-200 p-6">
          <h3 className="font-semibold text-teal-900 mb-2">Save your estimates year-round</h3>
          <p className="text-teal-800 text-sm mb-4">Create a free account to track actual income, add deductions, and export records for your CPA.</p>
          <Link href="/login" className="inline-flex items-center justify-center rounded-md bg-teal-700 px-6 py-3 text-sm font-medium text-white hover:bg-teal-800">Get Started Free</Link>
        </div>
        <p className="text-xs text-slate-500 mt-6">Disclaimer: This calculator provides estimates for informational purposes only, not tax advice.</p>
      </div>
    </div>
  );
}
