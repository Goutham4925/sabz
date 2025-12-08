// routes/contactPage.js
const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET contact page data
router.get("/", async (req, res) => {
  try {
    let page = await prisma.contactPage.findFirst();

    if (!page) {
      page = await prisma.contactPage.create({ data: {} });
    }

    res.json(page);
  } catch (err) {
    console.error("GET /api/contact-page ERROR:", err);
    res.status(500).json({ error: "Failed to load contact page" });
  }
});

// UPDATE contact page
router.put("/:id", async (req, res) => {
  try {
    const updated = await prisma.contactPage.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });

    res.json(updated);
  } catch (err) {
    console.error("PUT /api/contact-page ERROR:", err);
    res.status(500).json({ error: "Failed to update contact page" });
  }
});

module.exports = router;
