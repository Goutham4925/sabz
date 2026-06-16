import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireAuth } from "@/lib/auth";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  const { user } = await requireAuth(req);
  const { id } = await params;
  if (user?.id === id) return NextResponse.json({ message: "You cannot delete yourself." }, { status: 400 });
  try {
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
