import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tax Organizer for Content Creators | FreelanceTaxKit",
  description: "Estimate self-employment taxes on creator income, track deductions, and export clean records.",
};

export default function ForCreatorsPage() {
  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block rounded-full bg-purple-100 text-purple-700 px-4 py-1.5 text-sm font-medium mb-4">For Creators</div>
          <h1 className="text-4xl font-bold text-slate-900 mb-6">Creator income is unpredictable. Your taxes do not have to be.</h1>
          <p className="text-xl text-slate-600 mb-8">FreelanceTaxKit helps you estimate what you owe and keep clean records year-round.</p>
          <Link href="/login" className="rounded-lg bg-teal-700 hover:bg-teal-800 px-8 py-4 text-lg font-semibold text-white transition-colors">Start Free</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="rounded-xl border border-slate-200 p-6"><h3 className="font-semibold text-slate-900 mb-3">Track Multiple Income Sources</h3><p className="text-slate-600">Log brand deals, platform payouts, affiliate income, and course sales separately.</p></div>
          <div className="rounded-xl border border-slate-200 p-6"><h3 className="font-semibold text-slate-900 mb-3">Creator Deductions</h3><p className="text-slate-600">Equipment, software, home office, travel - log deductions by Schedule C category.</p></div>
          <div className="rounded-xl border border-slate-200 p-6"><h3 className="font-semibold text-slate-900 mb-3">Quarterly Reminders</h3><p className="text-slate-600">Get email reminders before estimated tax due dates with your current quarterly amount.</p></div>
          <div className="rounded-xl border border-slate-200 p-6"><h3 className="font-semibold text-slate-900 mb-3">Receipt Capture</h3><p className="text-slate-600">Upload receipts for equipment purchases, software, and subscriptions.</p></div>
        </div>
        <div className="bg-slate-900 text-white rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Built for creators who hate accounting</h2>
          <Link href="/login" className="rounded-lg bg-teal-500 hover:bg-teal-400 px-8 py-3 font-semibold text-white transition-colors">Get Started Free</Link>
        </div>
      </div>
    </div>
  );
}
