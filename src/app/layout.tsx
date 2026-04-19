import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "FreelanceTaxKit - 1099 Tax Estimates & Receipt Organizer",
  description: "Estimate your self-employment taxes, track deductions, upload receipts, and export clean records. Built for freelancers, creators, and gig workers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        <Toaster>
          {children}
        </Toaster>
      </body>
    </html>
  );
}
