import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const isList = searchParams.get("view") === "list";

    const products = isList
      ? await prisma.product.findMany({
          select: {
            id: true, name: true, description: true, price: true,
            image_url: true, is_featured: true, categoryId: true,
            rating: true, ratingCount: true,
            category: { select: { id: true, name: true } },
          },
          orderBy: { created_at: "desc" },
        })
      : await prisma.product.findMany({
          include: { category: true, images: true },
          orderBy: { created_at: "desc" },
        });

    return NextResponse.json(products, {
      headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=60" },
    });
  } catch (err) {
    console.error("GET /api/products error:", err);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description || null,
        price: data.price ? Number(data.price) : null,
        categoryId: data.categoryId ? Number(data.categoryId) : null,
        image_url: data.image_url || null,
        is_featured: Boolean(data.is_featured),
        rating: data.rating !== undefined ? Number(data.rating) : 4.5,
        ratingCount: data.ratingCount !== undefined ? Number(data.ratingCount) : 0,
        ingredients: data.ingredients || null,
        highlights: data.highlights || null,
        nutrition_info: data.nutrition_info || null,
        shelf_life: data.shelf_life || null,
        weight: data.weight || null,
        package_type: data.package_type || null,
      },
    });
    return NextResponse.json(product);
  } catch (err) {
    console.error("POST /api/products error:", err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
