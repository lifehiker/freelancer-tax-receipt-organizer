import Link from "next/link";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-teal-700">FreelanceTaxKit</Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/self-employed-tax-calculator" className="text-slate-600 hover:text-teal-700 transition-colors">Tax Calculator</Link>
            <Link href="/quarterly-tax-calculator" className="text-slate-600 hover:text-teal-700 transition-colors">Quarterly Estimator</Link>
            <Link href="/for-freelancers" className="text-slate-600 hover:text-teal-700 transition-colors">For Freelancers</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-slate-600 hover:text-teal-700">Sign In</Link>
            <Link href="/login" className="rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 transition-colors">Get Started Free</Link>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-slate-200 bg-slate-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">FreelanceTaxKit</h3>
              <p className="text-sm text-slate-600">1099 tax estimates and receipt organizer for solo operators.</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Tools</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><Link href="/self-employed-tax-calculator" className="hover:text-teal-700">Tax Calculator</Link></li>
                <li><Link href="/quarterly-tax-calculator" className="hover:text-teal-700">Quarterly Estimator</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">For</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><Link href="/for-freelancers" className="hover:text-teal-700">Freelancers</Link></li>
                <li><Link href="/for-creators" className="hover:text-teal-700">Creators</Link></li>
                <li><Link href="/for-landlords" className="hover:text-teal-700">Landlords</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Account</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><Link href="/login" className="hover:text-teal-700">Sign In</Link></li>
                <li><Link href="/login" className="hover:text-teal-700">Sign Up Free</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-200 text-center text-xs text-slate-500">
            <p>FreelanceTaxKit provides estimates for informational purposes only, not tax advice. Consult a qualified tax professional.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
