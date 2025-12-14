const express = require("express");
const prisma = require("../prisma/client");

const router = express.Router();


// ----------------------------
// GET /api/settings
// ----------------------------
router.get("/", async (req, res) => {
  try {
    let settings = await prisma.siteSetting.findFirst();

    if (!settings) {
      settings = await prisma.siteSetting.create({
        data: {
          hero_title: "Crafted with Tradition. Baked with Love.",
          hero_subtitle: "Premium biscuits made with the finest ingredients.",
        },
      });
    }

    res.json(settings);
  } catch (err) {
    console.error("GET /settings error:", err);
    res.status(500).json({ error: "Failed to fetch settings" });
  }

});

// ----------------------------
// PUT /api/settings/:id
// ----------------------------
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    // ✅ Explicit allow-list (NO filtering before this)
    const allowed = {
      hero_title: true,
      hero_subtitle: true,
      hero_badge_text: true,
      hero_image_url: true,
      hero_years_label: true,
      hero_customers_label: true,
      hero_flavors_label: true,

      about_badge: true,
      about_title: true,
      about_paragraph1: true,
      about_paragraph2: true,
      about_image_url: true,
      about_highlight_1_title: true,
      about_highlight_1_desc: true,
      about_highlight_2_title: true,
      about_highlight_2_desc: true,
      about_highlight_3_title: true,
      about_highlight_3_desc: true,
      about_highlight_4_title: true,
      about_highlight_4_desc: true,

      products_title: true,
      products_subtitle: true,

      cta_title: true,
      cta_subtitle: true,
      cta_image_url: true,
      cta_primary_label: true,
      cta_primary_href: true,
      cta_badge_text: true,

      footer_text: true,
      footer_subtext: true,

      privacy_policy: true,
      terms_conditions: true,
      
      social_facebook: true,
      social_instagram: true,
      social_twitter: true,

      navbar_logo: true,
      navbar_brand_image: true,
      show_company_text: true,
    };

    const data = {};

    // ✅ Copy ONLY allowed keys
    Object.keys(allowed).forEach((key) => {
      if (key in req.body) {
        data[key] = req.body[key] === "" ? null : req.body[key];
      }
    });


    const updated = await prisma.siteSetting.update({
      where: { id },
      data,
    });

    res.json(updated);
  } catch (err) {
    console.error("PUT /settings/:id error:", err);
    res.status(500).json({ error: "Failed to save settings" });
  }

});


module.exports = router;
