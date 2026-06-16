import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const data = { ...body };
    Object.keys(data).forEach((key) => {
      if (data[key] === "") data[key] = null;
      if (data[key] === "true") data[key] = true;
      if (data[key] === "false") data[key] = false;
    });
    delete data.id;
    const updated = await prisma.aboutPage.update({ where: { id: Number(id) }, data });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("PUT /api/about/:id error:", err);
    return NextResponse.json({ error: "Failed to update About Page" }, { status: 500 });
  }
}
