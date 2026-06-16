import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { url } = await req.json();
    const img = await prisma.productImage.create({ data: { url, productId: Number(id) } });
    return NextResponse.json(img);
  } catch (err) {
    console.error("Gallery upload error:", err);
    return NextResponse.json({ error: "Failed to add gallery image" }, { status: 500 });
  }
}
