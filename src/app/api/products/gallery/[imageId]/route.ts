import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ imageId: string }> }) {
  try {
    const { imageId } = await params;
    await prisma.productImage.delete({ where: { id: Number(imageId) } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete gallery image error:", err);
    return NextResponse.json({ error: "Failed to delete gallery image" }, { status: 500 });
  }
}
