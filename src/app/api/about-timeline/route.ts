import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { aboutId, year, title, desc } = await req.json();
  const last = await prisma.aboutTimeline.findFirst({ where: { aboutId }, orderBy: { order: "desc" } });
  const order = last ? last.order + 1 : 1;
  const item = await prisma.aboutTimeline.create({ data: { aboutId, year, title, desc, order } });
  return NextResponse.json(item);
}
