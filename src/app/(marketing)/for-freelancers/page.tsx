import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tax Estimator for Freelancers | FreelanceTaxKit",
  description: "Estimate quarterly taxes, track deductible expenses, upload receipts, and export clean records for freelancers.",
};

export default function ForFreelancersPage() {
  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block rounded-full bg-teal-100 text-teal-700 px-4 py-1.5 text-sm font-medium mb-4">For Freelancers</div>
          <h1 className="text-4xl font-bold text-slate-900 mb-6">Stop guessing what you owe in taxes. Know exactly.</h1>
          <p className="text-xl text-slate-600 mb-8">FreelanceTaxKit is built for solo freelancers earning 1099 income who want year-round visibility without a full bookkeeping suite.</p>
          <Link href="/login" className="rounded-lg bg-teal-700 hover:bg-teal-800 px-8 py-4 text-lg font-semibold text-white transition-colors">Start Free</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="rounded-xl border border-slate-200 p-6"><h3 className="font-semibold text-slate-900 mb-3">Quarterly Tax Dashboard</h3><p className="text-slate-600">See estimated annual tax, quarterly payment amount, and next due date based on your actual income.</p></div>
          <div className="rounded-xl border border-slate-200 p-6"><h3 className="font-semibold text-slate-900 mb-3">Deduction Tracking</h3><p className="text-slate-600">Log business expenses by Schedule C category. Home office, software, travel - track them all.</p></div>
          <div className="rounded-xl border border-slate-200 p-6"><h3 className="font-semibold text-slate-900 mb-3">Receipt Storage</h3><p className="text-slate-600">Upload receipt photos and link them to expense records. Build an audit-ready trail automatically.</p></div>
          <div className="rounded-xl border border-slate-200 p-6"><h3 className="font-semibold text-slate-900 mb-3">Clean Exports</h3><p className="text-slate-600">Export CSV or PDF summaries. Give your accountant exactly what they need, in seconds.</p></div>
        </div>
        <div className="bg-slate-900 text-white rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to stop dreading tax season?</h2>
          <Link href="/login" className="rounded-lg bg-teal-500 hover:bg-teal-400 px-8 py-3 font-semibold text-white transition-colors">Get Started Free</Link>
        </div>
      </div>
    </div>
  );
}
