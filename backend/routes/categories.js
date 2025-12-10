const express = require("express");
const prisma = require("../prisma/client");

const router = express.Router();

// GET all categories
router.get("/", async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// Create new category
router.post("/", async (req, res) => {
  const { name } = req.body;

  if (!name) return res.status(400).json({ error: "Name required" });

  try {
    const category = await prisma.category.create({
      data: { name },
    });

    res.json(category);
  } catch (err) {
    res.status(400).json({ error: "Category already exists" });
  }
});

// Delete category
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    await prisma.category.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: "Cannot delete category" });
  }
});

module.exports = router;
