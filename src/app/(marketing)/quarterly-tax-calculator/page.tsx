import type { Metadata } from "next";
import { TaxCalculatorForm } from "@/components/calculator/tax-calculator-form";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Quarterly Tax Calculator for Freelancers | FreelanceTaxKit",
  description: "Calculate your quarterly estimated tax payments as a freelancer.",
};

export default function QuarterlyTaxCalculatorPage() {
  return (
    <div className="py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Quarterly Tax Calculator for Freelancers</h1>
          <p className="text-xl text-slate-600">Calculate how much to set aside each quarter. Never miss an estimated tax payment again.</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 mb-8"><TaxCalculatorForm /></div>
        <div className="rounded-xl border border-slate-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">2024 Quarterly Tax Due Dates</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-slate-50 rounded-lg"><div className="font-bold text-teal-700">Q1</div><div className="text-sm">April 15, 2024</div></div>
            <div className="text-center p-3 bg-slate-50 rounded-lg"><div className="font-bold text-teal-700">Q2</div><div className="text-sm">June 17, 2024</div></div>
            <div className="text-center p-3 bg-slate-50 rounded-lg"><div className="font-bold text-teal-700">Q3</div><div className="text-sm">Sep 16, 2024</div></div>
            <div className="text-center p-3 bg-slate-50 rounded-lg"><div className="font-bold text-teal-700">Q4</div><div className="text-sm">Jan 15, 2025</div></div>
          </div>
        </div>
        <div className="rounded-lg bg-teal-50 border border-teal-200 p-6">
          <h3 className="font-semibold text-teal-900 mb-2">Track your actual income</h3>
          <p className="text-teal-800 text-sm mb-4">Create a free account to track income throughout the year and get a live quarterly estimate dashboard.</p>
          <Link href="/login" className="inline-flex items-center justify-center rounded-md bg-teal-700 px-6 py-3 text-sm font-medium text-white hover:bg-teal-800">Get Started Free</Link>
        </div>
      </div>
    </div>
  );
}
