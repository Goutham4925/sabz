// prisma/seed.js
const prisma = require("../prisma/client");
const bcrypt = require("bcryptjs");

async function main() {
  console.log("Seeding database...");

  // ---------------------------
  // ADMIN USER
  // ---------------------------
  const hashed = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      password: hashed,
      role: "admin",
    },
  });

  console.log("Admin user ready:", admin.email);

  // ---------------------------
  // SITE SETTINGS
  // ---------------------------
  let settings = await prisma.siteSetting.findFirst();

  if (!settings) {
    settings = await prisma.siteSetting.create({
    data: {
        hero_title: "Crafted with Tradition. Baked with Love.",
        hero_subtitle: "Premium biscuits made fresh every day.",
        hero_image_url: null,
        about_text: "Our bakery has been serving delicious products since 1980.",
    },
    });

  }

  console.log("Default Site Settings ready.");
}

main()
  .catch((err) => {
    console.error("Seed error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
