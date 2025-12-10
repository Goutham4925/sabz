const express = require("express");
const prisma = require("../prisma/client");

const router = express.Router();

/* ============================================================
   GET ALL PRODUCTS
   - Includes category info
============================================================ */
router.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
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
   GET PRODUCT BY ID
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
   CREATE PRODUCT
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
    } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        description: description || null,
        price: price ? Number(price) : null,
        categoryId: categoryId ? Number(categoryId) : null,
        image_url: image_url || null,
        is_featured: Boolean(is_featured),
      },
    });

    res.json(product);
  } catch (err) {
    console.error("POST /products error:", err);
    res.status(500).json({ error: "Failed to create product" });
  }
});

/* ============================================================
   UPDATE PRODUCT
============================================================ */
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id))
      return res.status(400).json({ error: "Invalid ID" });

    const {
      name,
      description,
      price,
      categoryId,
      image_url,
      is_featured,
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
      },
    });

    res.json(product);
  } catch (err) {
    console.error("PUT /products/:id error:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
});

/* ============================================================
   DELETE PRODUCT
============================================================ */
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id))
      return res.status(400).json({ error: "Invalid ID" });

    await prisma.product.delete({ where: { id } });

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE /products/:id error:", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

module.exports = router;
