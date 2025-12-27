// prisma/fix-image-urls.js
const prisma = require("./client");

// 🔁 CHANGE DOMAINS HERE
const OLD = "http://localhost:5000";
const NEW = "https://saabz-kitchen-backend.vercel.app"; // ✅ YOUR REAL BACKEND DOMAIN

function replace(value) {
  if (!value || typeof value !== "string") return value;
  return value.includes(OLD) ? value.replaceAll(OLD, NEW) : value;
}

async function updateProductImages() {
  const products = await prisma.product.findMany();
  for (const p of products) {
    const updated = replace(p.image_url);
    if (updated !== p.image_url) {
      await prisma.product.update({
        where: { id: p.id },
        data: { image_url: updated },
      });
      console.log("✔ Updated product image", p.id);
    }
  }
}

async function updateGalleryImages() {
  const images = await prisma.productImage.findMany();
  for (const img of images) {
    const updated = replace(img.url);
    if (updated !== img.url) {
      await prisma.productImage.update({
        where: { id: img.id },
        data: { url: updated },
      });
      console.log("✔ Updated gallery image", img.id);
    }
  }
}

async function updateSiteSettings() {
  const list = await prisma.siteSetting.findMany();
  for (const s of list) {
    const fields = [
      "hero_image_url",
      "cta_image_url",
      "navbar_logo",
      "navbar_brand_image",
      "about_image_url",
    ];

    const updates = {};
    for (const f of fields) {
      if (s[f]) {
        const replaced = replace(s[f]);
        if (replaced !== s[f]) updates[f] = replaced;
      }
    }

    if (Object.keys(updates).length > 0) {
      await prisma.siteSetting.update({
        where: { id: s.id },
        data: updates,
      });
      console.log("✔ Updated SiteSetting", s.id);
    }
  }
}

async function updateAboutPage() {
  const list = await prisma.aboutPage.findMany();
  for (const a of list) {
    const fields = [
      "hero_image_url",
      "team_1_image",
      "team_2_image",
      "team_3_image",
      "value_1_icon",
      "value_2_icon",
      "value_3_icon",
      "value_4_icon",
    ];

    const updates = {};
    for (const f of fields) {
      if (a[f]) {
        const replaced = replace(a[f]);
        if (replaced !== a[f]) updates[f] = replaced;
      }
    }

    if (Object.keys(updates).length > 0) {
      await prisma.aboutPage.update({
        where: { id: a.id },
        data: updates,
      });
      console.log("✔ Updated AboutPage", a.id);
    }
  }
}

async function updateContactPage() {
  const list = await prisma.contactPage.findMany();
  for (const c of list) {
    const fields = [
      "card_1_icon",
      "card_2_icon",
      "card_3_icon",
      "card_4_icon",
    ];

    const updates = {};
    for (const f of fields) {
      if (c[f]) {
        const replaced = replace(c[f]);
        if (replaced !== c[f]) updates[f] = replaced;
      }
    }

    if (Object.keys(updates).length > 0) {
      await prisma.contactPage.update({
        where: { id: c.id },
        data: updates,
      });
      console.log("✔ Updated ContactPage", c.id);
    }
  }
}

async function main() {
  console.log("🚀 Fixing image URLs...");
  await updateProductImages();
  await updateGalleryImages();
  await updateSiteSettings();
  await updateAboutPage();
  await updateContactPage();
  console.log("🎉 All URLs updated successfully!");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
