import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const featured = await prisma.product.findMany({
      where: { is_featured: true },
      select: {
        id: true, name: true, description: true, price: true,
        image_url: true, is_featured: true, categoryId: true,
        rating: true, ratingCount: true,
        category: { select: { id: true, name: true } },
      },
      orderBy: { created_at: "desc" },
    });
    return NextResponse.json(featured, {
      headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=60" },
    });
  } catch (err) {
    console.error("Featured products error:", err);
    return NextResponse.json({ error: "Failed to fetch featured products" }, { status: 500 });
  }
}
