import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const updated = await prisma.contactMessage.update({ where: { id: Number(id) }, data: { is_read: true } });
    return NextResponse.json({ success: true, updated });
  } catch (err) {
    console.error("Mark read error:", err);
    return NextResponse.json({ error: "Failed to mark as read" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.contactMessage.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete Error:", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
