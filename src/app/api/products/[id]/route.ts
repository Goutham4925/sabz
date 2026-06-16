import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: { category: true, images: true },
    });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json(product);
  } catch (err) {
    console.error("Fetch product error:", err);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await req.json();
    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name: data.name,
        description: data.description || null,
        price: data.price ? Number(data.price) : null,
        categoryId: data.categoryId ? Number(data.categoryId) : null,
        image_url: data.image_url || null,
        is_featured: Boolean(data.is_featured),
        rating: data.rating !== undefined ? Number(data.rating) : undefined,
        ratingCount: data.ratingCount !== undefined ? Number(data.ratingCount) : undefined,
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
    console.error("Update product error:", err);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.productImage.deleteMany({ where: { productId: Number(id) } });
    await prisma.product.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE product error:", err);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
