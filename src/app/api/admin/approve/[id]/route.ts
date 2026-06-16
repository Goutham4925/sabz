import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireAuth } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  const { user } = await requireAuth(req);
  const { id } = await params;
  if (user?.id === id) return NextResponse.json({ message: "You cannot approve yourself." }, { status: 400 });
  try {
    const updated = await prisma.user.update({ where: { id }, data: { isApproved: true } });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
