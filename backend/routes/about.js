const express = require("express");
const prisma = require("../prisma/client");

const router = express.Router();

// ------------------------------------
// GET /api/about  → Fetch About Page
// ------------------------------------
router.get("/", async (req, res) => {
  try {
    let about = await prisma.aboutPage.findFirst();

    if (!about) {
      about = await prisma.aboutPage.create({ data: {} });
    }

    const timeline = await prisma.aboutTimeline.findMany({
      where: { aboutId: about.id },
      orderBy: { order: "asc" },
    });

    res.json({
      ...about,
      timeline,
    });
  } catch (err) {
    console.error("GET /about error:", err);
    res.status(500).json({ error: "Failed to fetch About Page" });
  }
});


// ------------------------------------
// PUT /api/about/:id  → Update About Page
// ------------------------------------
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    let data = { ...req.body };

    // Convert "" → null
    Object.keys(data).forEach((key) => {
      if (data[key] === "") data[key] = null;
      if (data[key] === "true") data[key] = true;
      if (data[key] === "false") data[key] = false;
    });

    // ❌ DO NOT allow updating primary key
    delete data.id;

    const updated = await prisma.aboutPage.update({
      where: { id },
      data,
    });

    res.json(updated);

  } catch (err) {
    console.error("PUT /about/:id error:", err);
    res.status(500).json({ error: "Failed to update About Page" });
  }
});

module.exports = router;
