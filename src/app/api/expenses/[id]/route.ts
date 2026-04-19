import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const entry = await prisma.expenseEntry.findFirst({ where: { id, userId: session.user.id } });
  if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.expenseEntry.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
