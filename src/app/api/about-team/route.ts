import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { aboutId } = await req.json();
  const last = await prisma.teamMember.findFirst({ where: { aboutId }, orderBy: { order: "desc" } });
  const order = last ? last.order + 1 : 1;
  const member = await prisma.teamMember.create({ data: { aboutId, name: "", role: "", image: "", order } });
  return NextResponse.json(member);
}
