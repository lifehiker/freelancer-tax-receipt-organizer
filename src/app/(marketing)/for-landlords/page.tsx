import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tax Organizer for Small Landlords | FreelanceTaxKit",
  description: "Track rental income and expenses, upload receipts, and export clean records for tax time.",
};

export default function ForLandlordsPage() {
  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block rounded-full bg-amber-100 text-amber-700 px-4 py-1.5 text-sm font-medium mb-4">For Landlords</div>
          <h1 className="text-4xl font-bold text-slate-900 mb-6">Simple rental income and expense tracking for small landlords</h1>
          <p className="text-xl text-slate-600 mb-8">Track rental income, log deductible repairs and maintenance, upload receipts, and export clean records for your accountant.</p>
          <Link href="/login" className="rounded-lg bg-teal-700 hover:bg-teal-800 px-8 py-4 text-lg font-semibold text-white transition-colors">Start Free</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="rounded-xl border border-slate-200 p-6"><h3 className="font-semibold text-slate-900 mb-3">Rental Income Tracking</h3><p className="text-slate-600">Log rent payments by property and date. See your total rental income at a glance.</p></div>
          <div className="rounded-xl border border-slate-200 p-6"><h3 className="font-semibold text-slate-900 mb-3">Deductible Expenses</h3><p className="text-slate-600">Repairs, maintenance, property management, insurance - track all your deductions in one place.</p></div>
          <div className="rounded-xl border border-slate-200 p-6"><h3 className="font-semibold text-slate-900 mb-3">Receipt Storage</h3><p className="text-slate-600">Upload photos of contractor invoices, repair receipts, and supply purchases.</p></div>
          <div className="rounded-xl border border-slate-200 p-6"><h3 className="font-semibold text-slate-900 mb-3">Export for Your CPA</h3><p className="text-slate-600">Export CSV or PDF summaries. Give your accountant clean records instead of a shoebox of receipts.</p></div>
        </div>
        <div className="bg-slate-900 text-white rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Tax time made simple for small landlords</h2>
          <Link href="/login" className="rounded-lg bg-teal-500 hover:bg-teal-400 px-8 py-3 font-semibold text-white transition-colors">Get Started Free</Link>
        </div>
      </div>
    </div>
  );
}
