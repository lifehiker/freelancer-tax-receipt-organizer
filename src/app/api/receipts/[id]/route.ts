import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const receipt = await prisma.receipt.findUnique({ where: { id } });
  if (!receipt || receipt.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json() as {
    vendor?: string;
    totalCents?: number;
    receiptDate?: string;
  };

  const updated = await prisma.receipt.update({
    where: { id },
    data: {
      ...(body.vendor !== undefined && { vendor: body.vendor }),
      ...(body.totalCents !== undefined && { totalCents: body.totalCents }),
      ...(body.receiptDate !== undefined && { receiptDate: new Date(body.receiptDate) }),
      ocrStatus: "done",
    },
  });

  return NextResponse.json(updated);
}
