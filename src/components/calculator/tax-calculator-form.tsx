"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateSelfEmploymentTax } from "@/lib/tax/calculateSelfEmploymentTax";
import { calculateFederalEstimate } from "@/lib/tax/calculateFederalEstimate";
import type { FilingStatus } from "@/lib/tax/config/2024";

const schema = z.object({
  filingStatus: z.enum(["single", "marriedFilingJointly", "marriedFilingSeparately", "headOfHousehold"]),
  grossIncome: z.coerce.number().min(0),
  deductions: z.coerce.number().min(0).default(0),
  taxYear: z.coerce.number().default(2024),
});
type FormData = z.infer<typeof schema>;
interface Results { seTax: number; federalTax: number; totalTax: number; quarterlyPayment: number; setAsidePercent: number; }

export function TaxCalculatorForm() {
  const [results, setResults] = useState<Results | null>(null);
  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { filingStatus: "single", grossIncome: 0, deductions: 0, taxYear: 2024 },
  });
  function fmt(n: number) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n); }
  function onSubmit(data: FormData) {
    const { seTax, seDeduction } = calculateSelfEmploymentTax(data.grossIncome);
    const { federalTax } = calculateFederalEstimate({ grossIncome: data.grossIncome, filingStatus: data.filingStatus as FilingStatus, deductions: data.deductions, seDeduction });
    const totalTax = seTax + federalTax;
    const quarterlyPayment = totalTax / 4;
    const setAsidePercent = data.grossIncome > 0 ? Math.round((totalTax / data.grossIncome) * 100) : 0;
    setResults({ seTax, federalTax, totalTax, quarterlyPayment, setAsidePercent });
  }
  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Filing Status</Label>
            <Select {...register("filingStatus")}>
              <option value="single">Single</option>
              <option value="marriedFilingJointly">Married Filing Jointly</option>
              <option value="marriedFilingSeparately">Married Filing Separately</option>
              <option value="headOfHousehold">Head of Household</option>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Tax Year</Label>
            <Select {...register("taxYear")}>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Net Self-Employment Income ($)</Label>
            <Input type="number" step="1" min="0" placeholder="75000" {...register("grossIncome")} />
          </div>
          <div className="space-y-2">
            <Label>Additional Deductions ($)</Label>
            <Input type="number" step="1" min="0" placeholder="5000" {...register("deductions")} />
            <p className="text-xs text-slate-500">Standard deduction applied automatically.</p>
          </div>
        </div>
        <Button type="submit" size="lg" className="w-full">Calculate My Tax Estimate</Button>
      </form>
      {results && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-teal-200 bg-teal-50"><CardHeader className="pb-2"><CardTitle className="text-sm text-teal-700">SE Tax</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-teal-900">{fmt(results.seTax)}</p></CardContent></Card>
            <Card className="border-blue-200 bg-blue-50"><CardHeader className="pb-2"><CardTitle className="text-sm text-blue-700">Federal Tax</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-blue-900">{fmt(results.federalTax)}</p></CardContent></Card>
            <Card className="border-purple-200 bg-purple-50"><CardHeader className="pb-2"><CardTitle className="text-sm text-purple-700">Total Annual</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-purple-900">{fmt(results.totalTax)}</p></CardContent></Card>
            <Card className="border-orange-200 bg-orange-50"><CardHeader className="pb-2"><CardTitle className="text-sm text-orange-700">Quarterly</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-orange-900">{fmt(results.quarterlyPayment)}</p></CardContent></Card>
          </div>
          <div className="rounded-lg bg-slate-800 text-white p-4 text-center">
            <p className="text-lg font-semibold">Set aside <span className="text-teal-400">{results.setAsidePercent}%</span> of each payment for taxes</p>
          </div>
          <p className="text-xs text-slate-500 text-center">Disclaimer: Estimates are informational only, not tax advice.</p>
          <div className="text-center"><a href="/login" className="inline-flex items-center justify-center rounded-md bg-teal-700 px-6 py-3 text-sm font-medium text-white hover:bg-teal-800">Save Your Estimate - Sign Up Free</a></div>
        </div>
      )}
    </div>
  );
}
