import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  try {
    const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(users);
  } catch (err) {
    console.error("GET USERS ERROR:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
