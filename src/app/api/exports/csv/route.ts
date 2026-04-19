import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

function fmtCents(cents: number) {
  return (cents / 100).toFixed(2);
}

function escapeCsv(value: string): string {
  const dq = String.fromCharCode(34);
  if (value.includes(",") || value.includes(dq) || value.includes("\n")) {
    return dq + value.replace(new RegExp(dq, "g"), dq + dq) + dq;
  }
  return value;
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const subscription = await prisma.subscription.findUnique({ where: { userId: session.user.id } });
  if (!subscription || subscription.plan === "free") {
    return NextResponse.json({ error: "Upgrade required" }, { status: 403 });
  }

  const url = new URL(req.url);
  const type = url.searchParams.get("type") || "combined";
  const userId = session.user.id;

  let csv = "";

  if (type === "income") {
    const income = await prisma.incomeEntry.findMany({ where: { userId }, orderBy: { receivedAt: "desc" } });
    csv += "Type,Source,Category,Amount,Date,Notes\n";
    for (const e of income) {
      const row = [
        "Income",
        escapeCsv(e.source),
        escapeCsv(e.category),
        fmtCents(e.amountCents),
        new Date(e.receivedAt).toLocaleDateString(),
        escapeCsv(e.notes || ""),
      ].join(",");
      csv += row + "\n";
    }
  } else if (type === "expenses") {
    const expenses = await prisma.expenseEntry.findMany({ where: { userId }, orderBy: { spentAt: "desc" } });
    csv += "Type,Vendor,Category,Amount,Date,Notes\n";
    for (const e of expenses) {
      const row = [
        "Expense",
        escapeCsv(e.vendor),
        escapeCsv(e.category),
        fmtCents(e.amountCents),
        new Date(e.spentAt).toLocaleDateString(),
        escapeCsv(e.notes || ""),
      ].join(",");
      csv += row + "\n";
    }
  } else {
    const income = await prisma.incomeEntry.findMany({ where: { userId }, orderBy: { receivedAt: "desc" } });
    const expenses = await prisma.expenseEntry.findMany({ where: { userId }, orderBy: { spentAt: "desc" } });
    csv += "Type,Description,Category,Amount,Date,Notes\n";
    for (const e of income) {
      const row = [
        "Income",
        escapeCsv(e.source),
        escapeCsv(e.category),
        fmtCents(e.amountCents),
        new Date(e.receivedAt).toLocaleDateString(),
        escapeCsv(e.notes || ""),
      ].join(",");
      csv += row + "\n";
    }
    for (const e of expenses) {
      const row = [
        "Expense",
        escapeCsv(e.vendor),
        escapeCsv(e.category),
        "-" + fmtCents(e.amountCents),
        new Date(e.spentAt).toLocaleDateString(),
        escapeCsv(e.notes || ""),
      ].join(",");
      csv += row + "\n";
    }
  }

  const filename = "freelancetaxkit-" + type + "-" + new Date().toISOString().split("T")[0] + ".csv";
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=" + filename,
    },
  });
}