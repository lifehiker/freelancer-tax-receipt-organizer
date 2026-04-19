import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  vendor: z.string().min(1),
  category: z.string().min(1),
  amountCents: z.number().int().positive(),
  spentAt: z.string(),
  notes: z.string().optional(),
  receiptId: z.string().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const entries = await prisma.expenseEntry.findMany({
    where: { userId: session.user.id },
    orderBy: { spentAt: "desc" },
  });
  return NextResponse.json(entries);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

    const entry = await prisma.expenseEntry.create({
      data: {
        userId: session.user.id,
        vendor: parsed.data.vendor,
        category: parsed.data.category,
        amountCents: parsed.data.amountCents,
        spentAt: new Date(parsed.data.spentAt),
        notes: parsed.data.notes,
        receiptId: parsed.data.receiptId,
      },
    });
    return NextResponse.json(entry, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
