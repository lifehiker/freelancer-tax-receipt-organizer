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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";

const schema = z.object({
  filingStatus: z.enum(["single", "marriedFilingJointly", "marriedFilingSeparately", "headOfHousehold"]),
  stateCode: z.string().length(2),
  expectedAnnualIncome: z.coerce.number().min(0),
  deductionsEstimate: z.coerce.number().min(0).default(0),
  taxYear: z.coerce.number().default(2024),
  priorPayments: z.coerce.number().min(0).default(0),
});
type FormData = z.infer<typeof schema>;

const US_STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];

export default function OnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { filingStatus: "single", stateCode: "CA", expectedAnnualIncome: 0, deductionsEstimate: 0, taxYear: 2024, priorPayments: 0 },
  });

  async function onSubmit(data: FormData) {
    setLoading(true);
    try {
      const res = await fetch("/api/tax-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filingStatus: data.filingStatus,
          stateCode: data.stateCode,
          expectedAnnualIncomeCents: Math.round(data.expectedAnnualIncome * 100),
          deductionsEstimateCents: Math.round(data.deductionsEstimate * 100),
          taxYear: data.taxYear,
          priorPaymentsCents: Math.round(data.priorPayments * 100),
        }),
      });
      if (!res.ok) throw new Error();
      router.push("/dashboard");
    } catch {
      toast({ title: "Error", description: "Failed to save profile.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Set up your tax profile</h1>
        <p className="text-slate-600 mt-2">This helps us estimate your quarterly taxes accurately. You can update this anytime in Settings.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Tax Profile</CardTitle>
          <CardDescription>Your basic tax information for 2024 estimates</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                <Label>State</Label>
                <Select {...register("stateCode")}>
                  {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Expected Annual Income (USD)</Label>
                <Input type="number" step="1000" min="0" placeholder="75000" {...register("expectedAnnualIncome")} />
                <p className="text-xs text-slate-500">Your estimated gross self-employment income for the year</p>
              </div>
              <div className="space-y-2">
                <Label>Estimated Deductions (USD)</Label>
                <Input type="number" step="100" min="0" placeholder="5000" {...register("deductionsEstimate")} />
                <p className="text-xs text-slate-500">Business expenses you expect to deduct (beyond standard deduction)</p>
              </div>
              <div className="space-y-2">
                <Label>Tax Year</Label>
                <Select {...register("taxYear")}>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Estimated Payments Made (USD)</Label>
                <Input type="number" step="100" min="0" placeholder="0" {...register("priorPayments")} />
                <p className="text-xs text-slate-500">Quarterly payments already made this year</p>
              </div>
            </div>
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 text-sm text-slate-600">
              <strong>Note:</strong> These are used to estimate your taxes. This is not tax advice. Consult a qualified tax professional for personalized guidance.
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={loading}>{loading ? "Saving..." : "Continue to Dashboard"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
