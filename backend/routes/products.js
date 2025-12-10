const express = require("express");
const prisma = require("../prisma/client");

const router = express.Router();

/* ============================================================
   1️⃣ GET ALL PRODUCTS (ADMIN + PUBLIC)
============================================================ */
router.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        images: true, // ✅ include gallery
      },
      orderBy: { created_at: "desc" },
    });

  res.json(products);
  } catch (err) {
    console.error("GET /products error:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

/* ============================================================
   2️⃣ GET FEATURED PRODUCTS (HOME)
============================================================ */
router.get("/featured", async (req, res) => {
  try {
    const featured = await prisma.product.findMany({
      where: { is_featured: true },
      include: { category: true, images: true },
      orderBy: { created_at: "desc" },
    });

    res.json(featured);
  } catch (err) {
    console.error("Featured products error:", err);
    res.status(500).json({ error: "Failed to fetch featured products" });
  }
});

/* ============================================================
   3️⃣ GET PRODUCT BY ID
============================================================ */
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true, images: true },
    });

    if (!product) return res.status(404).json({ error: "Product not found" });

    res.json(product);
  } catch (err) {
    console.error("Fetch product error:", err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

/* ============================================================
   4️⃣ CREATE PRODUCT
============================================================ */
router.post("/", async (req, res) => {
  try {
    const data = req.body;

    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description || null,
        price: data.price ? Number(data.price) : null,
        categoryId: data.categoryId ? Number(data.categoryId) : null,
        image_url: data.image_url || null,
        is_featured: Boolean(data.is_featured),

        ingredients: data.ingredients || null,
        highlights: data.highlights || null,
        nutrition_info: data.nutrition_info || null,
        shelf_life: data.shelf_life || null,
        weight: data.weight || null,
        package_type: data.package_type || null,
      },
    });

    res.json(product);
  } catch (err) {
    console.error("Create product error:", err);
    res.status(500).json({ error: "Failed to create product" });
  }
});

/* ============================================================
   5️⃣ UPDATE PRODUCT
============================================================ */
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = req.body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description || null,
        price: data.price ? Number(data.price) : null,
        categoryId: data.categoryId ? Number(data.categoryId) : null,
        image_url: data.image_url || null,
        is_featured: Boolean(data.is_featured),

        ingredients: data.ingredients || null,
        highlights: data.highlights || null,
        nutrition_info: data.nutrition_info || null,
        shelf_life: data.shelf_life || null,
        weight: data.weight || null,
        package_type: data.package_type || null,
      },
    });

    res.json(product);
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
});

/* ============================================================
   6️⃣ ADD A SINGLE GALLERY IMAGE
============================================================ */
router.post("/:id/gallery", async (req, res) => {
  try {
    const { url } = req.body;
    const productId = Number(req.params.id);

    const img = await prisma.productImage.create({
      data: {
        url,
        productId,
      },
    });

    res.json(img);
  } catch (err) {
    console.error("Gallery upload error:", err);
    res.status(500).json({ error: "Failed to add gallery image" });
  }
});

/* ============================================================
   7️⃣ DELETE A GALLERY IMAGE
============================================================ */
router.delete("/gallery/:imageId", async (req, res) => {
  try {
    const imgId = Number(req.params.imageId);

    await prisma.productImage.delete({ where: { id: imgId } });

    res.json({ success: true });
  } catch (err) {
    console.error("Delete gallery image error:", err);
    res.status(500).json({ error: "Failed to delete gallery image" });
  }
});

/* ============================================================
   8️⃣ DELETE PRODUCT + GALLERY IMAGES
============================================================ */
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Remove gallery images first
    await prisma.productImage.deleteMany({ where: { productId: id } });

    await prisma.product.delete({ where: { id } });

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE product error:", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

module.exports = router;
