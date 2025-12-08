// backend/routes/settings.js
const express = require("express");
const prisma = require("../prisma/client");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

// --------------------------------------
// GET /api/settings  (PUBLIC)
// --------------------------------------
router.get("/", async (_req, res) => {
  try {
    let settings = await prisma.siteSetting.findFirst();

    if (!settings) {
      settings = await prisma.siteSetting.create({
        data: {
          hero_title: "Crafted with Tradition. Baked with Love.",
          hero_subtitle:
            "Experience the golden perfection of handcrafted biscuits, made with the finest ingredients and recipes passed down through generations.",
        },
      });
    }

    res.json(settings);
  } catch (err) {
    console.error("GET /settings error:", err);
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

// --------------------------------------
// PUT /api/settings/:id  (PROTECTED)
// --------------------------------------
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const {
      hero_title,
      hero_subtitle,
      hero_image_url,
      hero_badge,
      hero_cta_primary_label,
      hero_cta_primary_link,
      hero_cta_secondary_label,
      hero_cta_secondary_link,
      stat1_label,
      stat1_value,
      stat2_label,
      stat2_value,
      stat3_label,
      stat3_value,
      about_title,
      about_subtitle,
      about_text,
      highlight1_title,
      highlight1_text,
      highlight2_title,
      highlight2_text,
      highlight3_title,
      highlight3_text,
      highlight4_title,
      highlight4_text,
    } = req.body;

    const updated = await prisma.siteSetting.update({
      where: { id },
      data: {
        hero_title: hero_title ?? null,
        hero_subtitle: hero_subtitle ?? null,
        hero_image_url: hero_image_url ?? null,
        hero_badge: hero_badge ?? null,
        hero_cta_primary_label: hero_cta_primary_label ?? null,
        hero_cta_primary_link: hero_cta_primary_link ?? null,
        hero_cta_secondary_label: hero_cta_secondary_label ?? null,
        hero_cta_secondary_link: hero_cta_secondary_link ?? null,
        stat1_label: stat1_label ?? null,
        stat1_value: stat1_value ?? null,
        stat2_label: stat2_label ?? null,
        stat2_value: stat2_value ?? null,
        stat3_label: stat3_label ?? null,
        stat3_value: stat3_value ?? null,
        about_title: about_title ?? null,
        about_subtitle: about_subtitle ?? null,
        about_text: about_text ?? null,
        highlight1_title: highlight1_title ?? null,
        highlight1_text: highlight1_text ?? null,
        highlight2_title: highlight2_title ?? null,
        highlight2_text: highlight2_text ?? null,
        highlight3_title: highlight3_title ?? null,
        highlight3_text: highlight3_text ?? null,
        highlight4_title: highlight4_title ?? null,
        highlight4_text: highlight4_text ?? null,
      },
    });

    res.json(updated);
  } catch (err) {
    console.error("PUT /settings/:id error:", err);
    res.status(500).json({ error: "Failed to save settings" });
  }
});

module.exports = router;
