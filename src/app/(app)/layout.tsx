import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/income", label: "Income" },
  { href: "/expenses", label: "Expenses" },
  { href: "/receipts", label: "Receipts" },
  { href: "/exports", label: "Exports" },
  { href: "/settings", label: "Settings" },
  { href: "/billing", label: "Billing" },
];

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <Link href="/dashboard" className="text-lg font-bold text-teal-400">FreelanceTaxKit</Link>
          <p className="text-xs text-slate-400 mt-1 truncate">{session.user.email}</p>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="block rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <Link href="/api/auth/signout" className="block rounded-md px-3 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-white">Sign Out</Link>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
