// routes/contactPage.js
const express = require("express");
const router = express.Router();
const prisma = require("../prisma/client");

/* ============================================================
   GET /api/contact-page
   - Always returns ONE row
   - Auto-creates if missing
============================================================ */
router.get("/", async (req, res) => {
  try {
    let page = await prisma.contactPage.findFirst();

    if (!page) {
      page = await prisma.contactPage.create({
        data: {},
      });
    }

    res.json(page);
  } catch (err) {
    console.error("GET /api/contact-page ERROR:", err);
    res.status(500).json({ error: "Failed to load contact page" });
  }
});

/* ============================================================
   PUT /api/contact-page/:id
============================================================ */
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const exists = await prisma.contactPage.findUnique({
      where: { id },
    });

    if (!exists) {
      return res.status(404).json({ error: "Contact page not found" });
    }

    const updated = await prisma.contactPage.update({
      where: { id },
      data: req.body,
    });

    res.json(updated);
  } catch (err) {
    console.error("PUT /api/contact-page ERROR:", err);
    res.status(500).json({ error: "Failed to update contact page" });
  }
});

module.exports = router;
