import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let page = await prisma.contactPage.findFirst();
    if (!page) page = await prisma.contactPage.create({ data: {} });
    return NextResponse.json(page);
  } catch (err) {
    console.error("GET /api/contact-page error:", err);
    return NextResponse.json({ error: "Failed to load contact page" }, { status: 500 });
  }
}
