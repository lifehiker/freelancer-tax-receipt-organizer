import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  source: z.string().min(1),
  amountCents: z.number().int().positive(),
  receivedAt: z.string(),
  notes: z.string().optional(),
  category: z.string().default("freelance"),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const entries = await prisma.incomeEntry.findMany({
    where: { userId: session.user.id },
    orderBy: { receivedAt: "desc" },
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

    const entry = await prisma.incomeEntry.create({
      data: {
        userId: session.user.id,
        source: parsed.data.source,
        amountCents: parsed.data.amountCents,
        receivedAt: new Date(parsed.data.receivedAt),
        notes: parsed.data.notes,
        category: parsed.data.category,
      },
    });
    return NextResponse.json(entry, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
