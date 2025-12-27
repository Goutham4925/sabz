// prisma/seed.js
const prisma = require("./client");
const bcrypt = require("bcryptjs");

async function main() {
  console.log("🌱 Seeding database...");

  /* ============================================================
     1) ADMIN USER
  ============================================================ */
  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@example.com" },
  });

  if (!existingAdmin) {
    const hashed = await bcrypt.hash("admin123", 10);
    await prisma.user.create({
      data: {
        email: "admin@example.com",
        password: hashed,
        role: "admin",
        isApproved: true,
      },
    });
    console.log("✔ Admin created: admin@example.com");
  } else {
    console.log("ℹ Admin already exists, skipping.");
  }

  /* ============================================================
     2) DEFAULT SITE SETTINGS
  ============================================================ */
  const existingSettings = await prisma.siteSetting.findFirst();

  if (!existingSettings) {
    await prisma.siteSetting.create({
      data: {
        hero_title: "Crafted with Tradition. Baked with Love.",
        hero_subtitle:
          "Experience the golden perfection of handcrafted biscuits, made with the finest ingredients and recipes passed down through generations.",
        hero_badge_text: "Premium Artisan Quality Since 1980",
        hero_years_label: "40+",
        hero_customers_label: "50K+",
        hero_flavors_label: "25+",

        about_title: "A Legacy of Delicious Moments",
        about_paragraph1:
          "For over four decades, Golden Crust has been crafting the finest biscuits using time-honored recipes and the highest quality ingredients.",
        about_paragraph2:
          "Every biscuit we create is a celebration of tradition, craftsmanship, and the simple joy of sharing something delicious.",

        about_highlight_1_title: "Since 1980",
        about_highlight_1_desc: "Over 40 years of baking excellence",
        about_highlight_2_title: "Made with Love",
        about_highlight_2_desc: "Every biscuit crafted by hand",
        about_highlight_3_title: "Natural Ingredients",
        about_highlight_3_desc: "Only the finest ingredients",
        about_highlight_4_title: "Award Winning",
        about_highlight_4_desc: "Recognized for quality worldwide",

        products_title: "Our Signature Collection",
        products_subtitle: "Discover our most loved biscuits",

        cta_badge_text: "Perfect for Gifting",
        cta_title:
          "Ready to Experience <span class='text-golden'>Golden Perfection</span>?",
        cta_subtitle:
          "Order premium biscuits today and discover timeless flavors.",
        cta_primary_label: "Shop Now",
        cta_primary_href: "/products",

        footer_text: "Golden Crust — All rights reserved.",
        footer_subtext: "Crafting premium biscuits since 1980.",
        navbar_logo: "Golden Crust",
        show_company_text: true,
      },
    });

    console.log("✔ Default SiteSettings created.");
  } else {
    console.log("ℹ SiteSettings already exist, skipping.");
  }
}

main()
  .catch((err) => {
    console.error("❌ Seed error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect(); // 🔴 REQUIRED for scripts
  });
