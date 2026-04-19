import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

function fmtMoney(cents: number) {
  return "$" + (cents / 100).toFixed(2);
}

function fmtDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function groupBy<T>(items: T[], key: keyof T): Record<string, T[]> {
  return items.reduce((acc: Record<string, T[]>, item) => {
    const k = String(item[key]);
    if (!acc[k]) acc[k] = [];
    acc[k].push(item);
    return acc;
  }, {});
}

function sumCents<T extends { amountCents: number }>(items: T[]): number {
  return items.reduce((s, e) => s + e.amountCents, 0);
}
export async function GET(_req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const subscription = await prisma.subscription.findUnique({ where: { userId: session.user.id } });
  if (!subscription || subscription.plan === "free") {
    return NextResponse.json({ error: "Upgrade required" }, { status: 403 });
  }

  const userId = session.user.id;
  const [incomeEntries, expenseEntries, taxProfile, user] = await Promise.all([
    prisma.incomeEntry.findMany({ where: { userId }, orderBy: { receivedAt: "desc" } }),
    prisma.expenseEntry.findMany({ where: { userId }, orderBy: { spentAt: "desc" } }),
    prisma.taxProfile.findUnique({ where: { userId } }),
    prisma.user.findUnique({ where: { id: userId } }),
  ]);

  const totalIncomeCents = sumCents(incomeEntries);
  const totalExpenseCents = sumCents(expenseEntries);
  const netIncomeCents = totalIncomeCents - totalExpenseCents;
  const incomeByCategory = groupBy(incomeEntries, "category");
  const expenseByCategory = groupBy(expenseEntries, "category");

  const seTax = Math.max(0, netIncomeCents * 0.9235 * 0.153);
  const taxableIncomeDollars = Math.max(0, netIncomeCents / 100 - seTax / 100 / 2 - 14600);
  let fedTaxDollars = 0;
  if (taxableIncomeDollars > 47150) {
    fedTaxDollars = 1160 + 4266 + (taxableIncomeDollars - 47150) * 0.22;
  } else if (taxableIncomeDollars > 11600) {
    fedTaxDollars = 1160 + (taxableIncomeDollars - 11600) * 0.12;
  } else if (taxableIncomeDollars > 0) {
    fedTaxDollars = taxableIncomeDollars * 0.1;
  }
  const seTaxCents = Math.round(seTax);
  const fedTaxCents = Math.round(fedTaxDollars * 100);
  const totalTaxCents = seTaxCents + fedTaxCents;

  const generatedDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const taxYear = taxProfile?.taxYear ?? new Date().getFullYear();
  const incomeCatRows = Object.entries(incomeByCategory)
    .map(([cat, es]) => {
      const tot = sumCents(es);
      return `<tr><td>${cat}</td><td>${es.length}</td><td class="amt">${fmtMoney(tot)}</td></tr>`;
    })
    .join("");

  const expenseCatRows = Object.entries(expenseByCategory)
    .map(([cat, es]) => {
      const tot = sumCents(es);
      return `<tr><td>${cat}</td><td>${es.length}</td><td class="amt">${fmtMoney(tot)}</td></tr>`;
    })
    .join("");

  const incomeRows = incomeEntries
    .map((e) => `<tr><td>${fmtDate(e.receivedAt)}</td><td>${e.source}</td><td>${e.category}</td><td class="amt">${fmtMoney(e.amountCents)}</td><td>${e.notes ?? ""}</td></tr>`)
    .join("");

  const expenseRows = expenseEntries
    .map((e) => `<tr><td>${fmtDate(e.spentAt)}</td><td>${e.vendor}</td><td>${e.category}</td><td class="amt">-${fmtMoney(e.amountCents)}</td><td>${e.notes ?? ""}</td></tr>`)
    .join("");

  const noData3 = `<tr><td colspan="3" style="color:#94a3b8;padding:12px">No entries yet</td></tr>`;
  const noData5 = `<tr><td colspan="5" style="color:#94a3b8;padding:12px">No entries yet</td></tr>`;
  const css = `
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;font-size:14px;color:#1e293b;background:#f8fafc}
    .page{max-width:900px;margin:0 auto;background:white;padding:40px}
    .print-btn{background:#0f766e;color:white;padding:10px 22px;border:none;border-radius:6px;font-size:14px;font-weight:600;cursor:pointer;margin-bottom:28px;display:inline-block}
    .print-btn:hover{background:#115e59}
    h1{font-size:26px;font-weight:700;color:#0f766e;margin-bottom:4px}
    .subtitle{color:#64748b;font-size:13px;margin-bottom:28px}
    .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:36px}
    .card{background:#f1f5f9;border-radius:8px;padding:14px}
    .card .lbl{font-size:11px;color:#64748b;font-weight:500;text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px}
    .card .val{font-size:20px;font-weight:700;color:#0f172a}
    .card .val.pos{color:#16a34a}
    .card .val.neg{color:#dc2626}
    section{margin-bottom:36px}
    section h2{font-size:17px;font-weight:700;color:#0f172a;border-bottom:2px solid #0f766e;padding-bottom:7px;margin-bottom:14px}
    table{width:100%;border-collapse:collapse;font-size:13px}
    th{text-align:left;padding:8px 10px;background:#f1f5f9;font-weight:600;color:#475569;font-size:11px;text-transform:uppercase;letter-spacing:.04em}
    td{padding:8px 10px;border-bottom:1px solid #f1f5f9}
    tr:last-child td{border-bottom:none}
    td.amt{text-align:right;font-variant-numeric:tabular-nums;font-weight:600}
    .tax-row{display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px solid #f1f5f9}
    .tax-row.total{border-bottom:none;font-weight:700;font-size:15px;padding-top:12px}
    .disc{font-size:11px;color:#94a3b8;margin-top:36px;padding-top:14px;border-top:1px solid #e2e8f0;line-height:1.6}
    @media print{
      .print-btn{display:none!important}
      body{background:white}
      .page{padding:20px;max-width:100%}
      section{page-break-inside:avoid}
      tr{page-break-inside:avoid}
    }
  `;
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>FreelanceTaxKit Tax Report ${taxYear}</title>
<style>${css}</style>
</head>
<body>
<div class="page">
<button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
<h1>FreelanceTaxKit &mdash; Tax Report</h1>
<p class="subtitle">Tax Year ${taxYear} &bull; Generated ${generatedDate} &bull; ${user?.email ?? ""}</p>
<div class="grid">
  <div class="card"><div class="lbl">Total Income</div><div class="val pos">${fmtMoney(totalIncomeCents)}</div></div>
  <div class="card"><div class="lbl">Total Expenses</div><div class="val neg">-${fmtMoney(totalExpenseCents)}</div></div>
  <div class="card"><div class="lbl">Net Income</div><div class="val">${fmtMoney(netIncomeCents)}</div></div>
  <div class="card"><div class="lbl">Est. Total Tax</div><div class="val neg">-${fmtMoney(totalTaxCents)}</div></div>
</div>
<section>
  <h2>Income by Category</h2>
  <table><thead><tr><th>Category</th><th>Entries</th><th>Total</th></tr></thead>
  <tbody>${incomeCatRows || noData3}</tbody></table>
</section>
<section>
  <h2>Expenses by Category</h2>
  <table><thead><tr><th>Category</th><th>Entries</th><th>Total</th></tr></thead>
  <tbody>${expenseCatRows || noData3}</tbody></table>
</section>
<section>
  <h2>Tax Estimate</h2>
  <div class="tax-row"><span>Gross Income</span><span>${fmtMoney(totalIncomeCents)}</span></div>
  <div class="tax-row"><span>Business Expenses</span><span>-${fmtMoney(totalExpenseCents)}</span></div>
  <div class="tax-row"><span>Net Self-Employment Income</span><span>${fmtMoney(netIncomeCents)}</span></div>
  <div class="tax-row"><span>Self-Employment Tax (15.3%)</span><span>-${fmtMoney(seTaxCents)}</span></div>
  <div class="tax-row"><span>Federal Income Tax (est.)</span><span>-${fmtMoney(fedTaxCents)}</span></div>
  <div class="tax-row total"><span>Estimated Total Tax Liability</span><span>-${fmtMoney(totalTaxCents)}</span></div>
</section>
<section>
  <h2>Income Detail</h2>
  <table><thead><tr><th>Date</th><th>Source</th><th>Category</th><th>Amount</th><th>Notes</th></tr></thead>
  <tbody>${incomeRows || noData5}</tbody></table>
</section>
<section>
  <h2>Expense Detail</h2>
  <table><thead><tr><th>Date</th><th>Vendor</th><th>Category</th><th>Amount</th><th>Notes</th></tr></thead>
  <tbody>${expenseRows || noData5}</tbody></table>
</section>
<p class="disc">This report is for informational purposes only and not tax advice. Tax estimates use simplified 2024 federal brackets for single filers with a 14600 USD standard deduction. Actual liability may vary. Consult a qualified tax professional.</p>
</div>
</body>
</html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
