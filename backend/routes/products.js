const express = require("express");
const prisma = require("../prisma/client");

const router = express.Router();

/* ============================================================
   1️⃣ GET ALL PRODUCTS (ADMIN + PUBLIC LISTING)
   Includes category
============================================================ */
router.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { created_at: "desc" },
    });

    res.json(products);
  } catch (err) {
    console.error("GET /products error:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

/* ============================================================
   2️⃣ GET ONLY FEATURED PRODUCTS (HOMEPAGE)
============================================================ */
router.get("/featured", async (req, res) => {
  try {
    const featured = await prisma.product.findMany({
      where: { is_featured: true },
      include: { category: true },
      orderBy: { created_at: "desc" },
    });

    res.json(featured);
  } catch (err) {
    console.error("GET /products/featured error:", err);
    res.status(500).json({ error: "Failed to fetch featured products" });
  }
});

/* ============================================================
   3️⃣ GET PRODUCT BY ID (includes category)
============================================================ */
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id))
      return res.status(400).json({ error: "Invalid ID" });

    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product)
      return res.status(404).json({ error: "Product not found" });

    res.json(product);
  } catch (err) {
    console.error("GET /products/:id error:", err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

/* ============================================================
   4️⃣ CREATE PRODUCT  (ALL FIELDS INCLUDED)
============================================================ */
router.post("/", async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      categoryId,
      image_url,
      is_featured,

      // NEW FIELDS
      ingredients,
      highlights,
      nutrition_info,
      shelf_life,
      weight,
      package_type,
    } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        description: description || null,
        price: price ? Number(price) : null,
        categoryId: categoryId ? Number(categoryId) : null,
        image_url: image_url || null,
        is_featured: Boolean(is_featured),

        // NEW FIELDS
        ingredients: ingredients || null,
        highlights: highlights || null,
        nutrition_info: nutrition_info || null,
        shelf_life: shelf_life || null,
        weight: weight || null,
        package_type: package_type || null,
      },
    });

    res.json(product);
  } catch (err) {
    console.error("POST /products error:", err);
    res.status(500).json({ error: "Failed to create product" });
  }
});

/* ============================================================
   5️⃣ UPDATE PRODUCT  (ALL FIELDS INCLUDED)
============================================================ */
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const {
      name,
      description,
      price,
      categoryId,
      image_url,
      is_featured,

      // NEW FIELDS
      ingredients,
      highlights,
      nutrition_info,
      shelf_life,
      weight,
      package_type,
    } = req.body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description: description || null,
        price: price ? Number(price) : null,
        categoryId: categoryId ? Number(categoryId) : null,
        image_url: image_url || null,
        is_featured: Boolean(is_featured),

        // NEW FIELDS
        ingredients: ingredients || null,
        highlights: highlights || null,
        nutrition_info: nutrition_info || null,
        shelf_life: shelf_life || null,
        weight: weight || null,
        package_type: package_type || null,
      },
    });

    res.json(product);
  } catch (err) {
    console.error("PUT /products/:id error:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
});

/* ============================================================
   6️⃣ DELETE PRODUCT
============================================================ */
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.product.delete({ where: { id } });

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE /products/:id error:", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

module.exports = router;
