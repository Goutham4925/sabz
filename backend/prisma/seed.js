const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ------------------------------------------------------------------
  // 1) ADMIN USER
  // ------------------------------------------------------------------
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
    console.log("Admin created: admin@example.com");
  } else {
    console.log("Admin already exists, skipping creation.");
  }

  // ------------------------------------------------------------------
  // 2) DEFAULT SITE SETTINGS
  // ------------------------------------------------------------------
  const existingSettings = await prisma.siteSetting.findFirst();

  if (!existingSettings) {
    await prisma.siteSetting.create({
      data: {
        // ---------------- HERO ----------------
        hero_title: "Crafted with Tradition. Baked with Love.",
        hero_subtitle:
          "Experience the golden perfection of handcrafted biscuits, made with the finest ingredients and recipes passed down through generations.",
        hero_badge_text: "Premium Artisan Quality Since 1980",
        hero_image_url: null,
        hero_years_label: "40+",
        hero_customers_label: "50K+",
        hero_flavors_label: "25+",

        // ---------------- ABOUT ----------------
        about_title: "A Legacy of Delicious Moments",
        about_paragraph1:
          "For over four decades, Golden Crust has been crafting the finest biscuits using time-honored recipes and the highest quality ingredients.",
        about_paragraph2:
          "Every biscuit we create is a celebration of tradition, craftsmanship, and the simple joy of sharing something delicious.",
        about_image_url:
          "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=700&fit=crop",

        about_highlight_1_title: "Since 1980",
        about_highlight_1_desc: "Over 40 years of baking excellence",
        about_highlight_2_title: "Made with Love",
        about_highlight_2_desc: "Every biscuit crafted by hand",
        about_highlight_3_title: "Natural Ingredients",
        about_highlight_3_desc: "Only the finest, organic materials",
        about_highlight_4_title: "Award Winning",
        about_highlight_4_desc: "Recognized for quality worldwide",

        // ---------------- PRODUCTS ----------------
        products_title: "Our Signature Collection",
        products_subtitle: "Discover our most loved biscuits",

        // ---------------- CTA ----------------
        cta_badge_text: "Perfect for Gifting",
        cta_title:
          "Ready to Experience <span class='text-golden'>Golden Perfection</span>?",
        cta_subtitle:
          "Order premium biscuits today and discover timeless flavors.",
        cta_primary_label: "Shop Now",
        cta_primary_href: "/products",

        // ---------------- FOOTER / NAVBAR ----------------
        footer_text: "Golden Crust — All rights reserved.",
        footer_subtext: "Crafting premium biscuits since 1980.",
        navbar_logo: "Golden Crust",
      },
    });

    console.log("Default SiteSettings created.");
  } else {
    console.log("SiteSettings already exist, skipping creation.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
