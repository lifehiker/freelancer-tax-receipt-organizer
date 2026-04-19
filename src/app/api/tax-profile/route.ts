import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  filingStatus: z.string(),
  stateCode: z.string().length(2),
  expectedAnnualIncomeCents: z.number().int().min(0),
  deductionsEstimateCents: z.number().int().min(0),
  taxYear: z.number().int(),
  priorPaymentsCents: z.number().int().min(0),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

    const profile = await prisma.taxProfile.upsert({
      where: { userId: session.user.id },
      update: parsed.data,
      create: { userId: session.user.id, ...parsed.data },
    });
    return NextResponse.json(profile);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
