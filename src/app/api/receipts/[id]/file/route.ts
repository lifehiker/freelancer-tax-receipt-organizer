import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import fs from "fs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const receipt = await prisma.receipt.findUnique({ where: { id } });
  if (!receipt || receipt.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let filePath: string;
  try {
    const parsed = JSON.parse(receipt.rawOcrJson ?? "{}") as { filePath?: string };
    filePath = parsed.filePath ?? "";
  } catch {
    return NextResponse.json({ error: "File path not found" }, { status: 404 });
  }

  if (!filePath || !fs.existsSync(filePath)) {
    return NextResponse.json({ error: "File not found on disk" }, { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);
  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": receipt.mimeType,
      "Content-Disposition": `inline; filename="${receipt.fileName}"`,
    },
  });
}
