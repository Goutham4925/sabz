import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  const { id } = await params;
  try {
    const updated = await prisma.user.update({ where: { id }, data: { role: "ADMIN" } });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
