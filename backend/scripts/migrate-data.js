/**
 * One-time data migration: Aiven → Supabase
 * Run: node scripts/migrate-data.js
 */

const { PrismaClient } = require("@prisma/client");

// Set these in your shell before running:
//   AIVEN_URL=postgres://avnadmin:...
//   SUPABASE_URL=postgresql://postgres...
const AIVEN_URL = process.env.AIVEN_URL;
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.DIRECT_URL;

const src = new PrismaClient({ datasources: { db: { url: AIVEN_URL } } });
const dst = new PrismaClient({ datasources: { db: { url: SUPABASE_URL } } });

async function copy(label, fetchFn, insertFn) {
  const rows = await fetchFn();
  if (!rows.length) { console.log(`  ${label}: 0 rows — skip`); return; }
  await insertFn(rows);
  console.log(`  ${label}: ${rows.length} rows ✓`);
}

async function main() {
  console.log("\n🚀 Starting migration Aiven → Supabase\n");

  // ── 1. Categories ──────────────────────────────────────────
  await copy("Category",
    () => src.category.findMany(),
    (rows) => dst.$executeRawUnsafe(
      `INSERT INTO "Category" (id, name, "createdAt") VALUES ${rows.map(
        (r) => `(${r.id}, ${esc(r.name)}, '${r.createdAt.toISOString()}')`
      ).join(",")} ON CONFLICT (id) DO NOTHING`
    )
  );

  // ── 2. Users ───────────────────────────────────────────────
  await copy("User",
    () => src.user.findMany(),
    (rows) => dst.$executeRawUnsafe(
      `INSERT INTO "User" (id, email, password, role, "createdAt", "isApproved") VALUES ${rows.map(
        (r) => `(${esc(r.id)}, ${esc(r.email)}, ${esc(r.password)}, ${esc(r.role)}, '${r.createdAt.toISOString()}', ${r.isApproved})`
      ).join(",")} ON CONFLICT (id) DO NOTHING`
    )
  );

  // ── 3. SiteSettings ───────────────────────────────────────
  const settings = await src.siteSetting.findMany();
  if (settings.length) {
    for (const s of settings) {
      await dst.siteSetting.upsert({
        where: { id: s.id },
        update: s,
        create: s,
      });
    }
    console.log(`  SiteSetting: ${settings.length} rows ✓`);
  }

  // ── 4. AboutPage ──────────────────────────────────────────
  const aboutPages = await src.aboutPage.findMany();
  if (aboutPages.length) {
    for (const a of aboutPages) {
      await dst.aboutPage.upsert({ where: { id: a.id }, update: a, create: a });
    }
    console.log(`  AboutPage: ${aboutPages.length} rows ✓`);
  }

  // ── 5. ContactPage ────────────────────────────────────────
  const contactPages = await src.contactPage.findMany();
  if (contactPages.length) {
    for (const c of contactPages) {
      await dst.contactPage.upsert({ where: { id: c.id }, update: c, create: c });
    }
    console.log(`  ContactPage: ${contactPages.length} rows ✓`);
  }

  // ── 6. Products ───────────────────────────────────────────
  const products = await src.product.findMany();
  if (products.length) {
    for (const p of products) {
      await dst.product.upsert({
        where: { id: p.id },
        update: p,
        create: p,
      });
    }
    console.log(`  Product: ${products.length} rows ✓`);
  }

  // ── 7. ProductImages ──────────────────────────────────────
  const images = await src.productImage.findMany();
  if (images.length) {
    for (const img of images) {
      await dst.productImage.upsert({
        where: { id: img.id },
        update: img,
        create: img,
      });
    }
    console.log(`  ProductImage: ${images.length} rows ✓`);
  }

  // ── 8. AboutTimeline ──────────────────────────────────────
  const timelines = await src.aboutTimeline.findMany();
  if (timelines.length) {
    for (const t of timelines) {
      await dst.aboutTimeline.upsert({
        where: { id: t.id },
        update: t,
        create: t,
      });
    }
    console.log(`  AboutTimeline: ${timelines.length} rows ✓`);
  }

  // ── 9. TeamMembers ────────────────────────────────────────
  const team = await src.teamMember.findMany();
  if (team.length) {
    for (const m of team) {
      await dst.teamMember.upsert({
        where: { id: m.id },
        update: m,
        create: m,
      });
    }
    console.log(`  TeamMember: ${team.length} rows ✓`);
  }

  // ── 10. ContactMessages ───────────────────────────────────
  const messages = await src.contactMessage.findMany();
  if (messages.length) {
    for (const m of messages) {
      await dst.contactMessage.upsert({
        where: { id: m.id },
        update: m,
        create: m,
      });
    }
    console.log(`  ContactMessage: ${messages.length} rows ✓`);
  }

  // ── Fix sequences so new inserts don't conflict ───────────
  console.log("\n🔧 Fixing auto-increment sequences...");
  const seqs = [
    [`"Category"`, "Category_id_seq"],
    [`"Product"`, "Product_id_seq"],
    [`"ProductImage"`, "ProductImage_id_seq"],
    [`"SiteSettings"`, "SiteSettings_id_seq"],
    [`"AboutPage"`, "AboutPage_id_seq"],
    [`"ContactPage"`, "ContactPage_id_seq"],
    [`"ContactMessage"`, "ContactMessage_id_seq"],
    [`"AboutTimeline"`, "AboutTimeline_id_seq"],
    [`"TeamMember"`, "TeamMember_id_seq"],
  ];

  for (const [table, seq] of seqs) {
    try {
      await dst.$executeRawUnsafe(
        `SELECT setval('${seq}', COALESCE((SELECT MAX(id) FROM ${table}), 1))`
      );
    } catch {
      // sequence may have different name, skip
    }
  }
  console.log("  Sequences fixed ✓");

  console.log("\n✅ Migration complete!\n");
}

function esc(v) {
  if (v === null || v === undefined) return "NULL";
  return `'${String(v).replace(/'/g, "''")}'`;
}

main()
  .catch((e) => { console.error("\n❌ Migration failed:", e.message); process.exit(1); })
  .finally(async () => { await src.$disconnect(); await dst.$disconnect(); });
