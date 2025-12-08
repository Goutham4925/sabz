/*
  Warnings:

  - You are about to drop the column `about_subtitle` on the `SiteSettings` table. All the data in the column will be lost.
  - You are about to drop the column `about_text` on the `SiteSettings` table. All the data in the column will be lost.
  - You are about to drop the column `cta_badge_text` on the `SiteSettings` table. All the data in the column will be lost.
  - You are about to drop the column `cta_highlight` on the `SiteSettings` table. All the data in the column will be lost.
  - You are about to drop the column `cta_primary_link` on the `SiteSettings` table. All the data in the column will be lost.
  - You are about to drop the column `cta_primary_text` on the `SiteSettings` table. All the data in the column will be lost.
  - You are about to drop the column `cta_secondary_link` on the `SiteSettings` table. All the data in the column will be lost.
  - You are about to drop the column `cta_secondary_text` on the `SiteSettings` table. All the data in the column will be lost.
  - You are about to drop the column `hero_badge` on the `SiteSettings` table. All the data in the column will be lost.
  - You are about to drop the column `hero_cta_primary_label` on the `SiteSettings` table. All the data in the column will be lost.
  - You are about to drop the column `hero_cta_primary_link` on the `SiteSettings` table. All the data in the column will be lost.
  - You are about to drop the column `hero_cta_secondary_label` on the `SiteSettings` table. All the data in the column will be lost.
  - You are about to drop the column `hero_cta_secondary_link` on the `SiteSettings` table. All the data in the column will be lost.
  - You are about to drop the column `highlight1_text` on the `SiteSettings` table. All the data in the column will be lost.
  - You are about to drop the column `highlight1_title` on the `SiteSettings` table. All the data in the column will be lost.
  - You are about to drop the column `highlight2_text` on the `SiteSettings` table. All the data in the column will be lost.
  - You are about to drop the column `highlight2_title` on the `SiteSettings` table. All the data in the column will be lost.
  - You are about to drop the column `highlight3_text` on the `SiteSettings` table. All the data in the column will be lost.
  - You are about to drop the column `highlight3_title` on the `SiteSettings` table. All the data in the column will be lost.
  - You are about to drop the column `highlight4_text` on the `SiteSettings` table. All the data in the column will be lost.
  - You are about to drop the column `highlight4_title` on the `SiteSettings` table. All the data in the column will be lost.
  - You are about to drop the column `stat1_label` on the `SiteSettings` table. All the data in the column will be lost.
  - You are about to drop the column `stat1_value` on the `SiteSettings` table. All the data in the column will be lost.
  - You are about to drop the column `stat2_label` on the `SiteSettings` table. All the data in the column will be lost.
  - You are about to drop the column `stat2_value` on the `SiteSettings` table. All the data in the column will be lost.
  - You are about to drop the column `stat3_label` on the `SiteSettings` table. All the data in the column will be lost.
  - You are about to drop the column `stat3_value` on the `SiteSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SiteSettings" DROP COLUMN "about_subtitle",
DROP COLUMN "about_text",
DROP COLUMN "cta_badge_text",
DROP COLUMN "cta_highlight",
DROP COLUMN "cta_primary_link",
DROP COLUMN "cta_primary_text",
DROP COLUMN "cta_secondary_link",
DROP COLUMN "cta_secondary_text",
DROP COLUMN "hero_badge",
DROP COLUMN "hero_cta_primary_label",
DROP COLUMN "hero_cta_primary_link",
DROP COLUMN "hero_cta_secondary_label",
DROP COLUMN "hero_cta_secondary_link",
DROP COLUMN "highlight1_text",
DROP COLUMN "highlight1_title",
DROP COLUMN "highlight2_text",
DROP COLUMN "highlight2_title",
DROP COLUMN "highlight3_text",
DROP COLUMN "highlight3_title",
DROP COLUMN "highlight4_text",
DROP COLUMN "highlight4_title",
DROP COLUMN "stat1_label",
DROP COLUMN "stat1_value",
DROP COLUMN "stat2_label",
DROP COLUMN "stat2_value",
DROP COLUMN "stat3_label",
DROP COLUMN "stat3_value",
ADD COLUMN     "about_highlight_1_desc" TEXT,
ADD COLUMN     "about_highlight_1_title" TEXT,
ADD COLUMN     "about_highlight_2_desc" TEXT,
ADD COLUMN     "about_highlight_2_title" TEXT,
ADD COLUMN     "about_highlight_3_desc" TEXT,
ADD COLUMN     "about_highlight_3_title" TEXT,
ADD COLUMN     "about_highlight_4_desc" TEXT,
ADD COLUMN     "about_highlight_4_title" TEXT,
ADD COLUMN     "about_image_url" TEXT,
ADD COLUMN     "about_paragraph1" TEXT,
ADD COLUMN     "about_paragraph2" TEXT,
ADD COLUMN     "cta_image_url" TEXT,
ADD COLUMN     "cta_primary_href" TEXT,
ADD COLUMN     "cta_primary_label" TEXT,
ADD COLUMN     "footer_subtext" TEXT,
ADD COLUMN     "footer_text" TEXT,
ADD COLUMN     "hero_badge_text" TEXT,
ADD COLUMN     "hero_customers_label" TEXT,
ADD COLUMN     "hero_flavors_label" TEXT,
ADD COLUMN     "hero_years_label" TEXT,
ADD COLUMN     "navbar_logo" TEXT,
ADD COLUMN     "products_subtitle" TEXT,
ADD COLUMN     "products_title" TEXT,
ALTER COLUMN "about_title" DROP DEFAULT,
ALTER COLUMN "cta_subtitle" DROP DEFAULT,
ALTER COLUMN "cta_title" DROP DEFAULT;
