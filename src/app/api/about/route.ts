import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let about = await prisma.aboutPage.findFirst({
      include: { timeline: { orderBy: { order: "asc" } }, teamMembers: { orderBy: { order: "asc" } } },
    });
    if (!about) {
      about = await prisma.aboutPage.create({ data: {}, include: { timeline: true, teamMembers: true } });
    }
    return NextResponse.json(about);
  } catch (err) {
    console.error("GET /api/about error:", err);
    return NextResponse.json({ error: "Failed to fetch About Page" }, { status: 500 });
  }
}
