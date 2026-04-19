import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const receipts = await prisma.receipt.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(receipts);
}

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function getUploadDir(): string {
  const primary = "/data/uploads";
  try {
    fs.mkdirSync(primary, { recursive: true });
    const testFile = path.join(primary, ".write-test");
    fs.writeFileSync(testFile, "");
    fs.unlinkSync(testFile);
    return primary;
  } catch {
    const fallback = path.join(process.cwd(), "public", "uploads");
    fs.mkdirSync(fallback, { recursive: true });
    return fallback;
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Invalid file type. Only JPEG, PNG, WebP, and PDF are allowed." },
      { status: 400 }
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "File too large. Maximum size is 10MB." },
      { status: 400 }
    );
  }

  const uploadDir = getUploadDir();
  const ext = path.extname(file.name) || (file.type === "application/pdf" ? ".pdf" : ".jpg");
  const uniqueName = `${crypto.randomUUID()}${ext}`;
  const filePath = path.join(uploadDir, uniqueName);

  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, buffer);

  // Create the receipt record first to get an id
  const receipt = await prisma.receipt.create({
    data: {
      userId: session.user.id,
      fileName: file.name,
      mimeType: file.type,
      fileUrl: "", // placeholder, updated below
      rawOcrJson: JSON.stringify({ filePath }),
      ocrStatus: "manual",
    },
  });

  // Update fileUrl to the serve endpoint now that we have the id
  const updated = await prisma.receipt.update({
    where: { id: receipt.id },
    data: { fileUrl: `/api/receipts/${receipt.id}/file` },
  });

  return NextResponse.json(updated, { status: 201 });
}
