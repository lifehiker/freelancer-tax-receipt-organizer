import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FreelanceTaxKit - 1099 Tax Estimates and Receipt Organizer",
  description: "Estimate self-employment taxes, track deductions, and export clean records for freelancers.",
};

export default function HomePage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-slate-900 to-teal-900 text-white py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Stop Dreading Tax Season. Start 30 seconds from now.</h1>
          <p className="text-xl text-slate-300 mb-10">Know exactly what you owe each quarter. Track deductions. Store receipts. Export clean records.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/self-employed-tax-calculator" className="rounded-lg bg-teal-500 hover:bg-teal-400 px-8 py-4 text-lg font-semibold text-white transition-colors">Try the Free Calculator</Link>
            <Link href="/login" className="rounded-lg border border-white/30 bg-white/10 hover:bg-white/20 px-8 py-4 text-lg font-semibold text-white transition-colors">Get Started Free</Link>
          </div>
        </div>
      </section>
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-12">Sound familiar?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl border p-6"><h3 className="font-semibold text-slate-900 mb-2">Scrambling at tax time?</h3><p className="text-slate-600 text-sm">Track all year so April is just a download, not a panic.</p></div>
            <div className="bg-white rounded-xl border p-6"><h3 className="font-semibold text-slate-900 mb-2">Missed quarterly payments?</h3><p className="text-slate-600 text-sm">See your next due date on your dashboard.</p></div>
            <div className="bg-white rounded-xl border p-6"><h3 className="font-semibold text-slate-900 mb-2">Losing receipts?</h3><p className="text-slate-600 text-sm">Upload photos, organize by category, export when needed.</p></div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-teal-700 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Know your quarterly tax number in 60 seconds</h2>
          <p className="text-teal-100 mb-8">Free to start. No credit card required.</p>
          <Link href="/self-employed-tax-calculator" className="rounded-lg bg-white text-teal-700 px-8 py-4 font-semibold hover:bg-teal-50 transition-colors">Try Free Calculator</Link>
        </div>
      </section>
    </div>
  );
}
