import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const updated = await prisma.contactPage.update({ where: { id: Number(id) }, data: body });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("PUT /api/contact-page error:", err);
    return NextResponse.json({ error: "Failed to update contact page" }, { status: 500 });
  }
}
