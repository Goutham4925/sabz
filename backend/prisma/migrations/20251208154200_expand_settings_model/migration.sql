/*
  Warnings:

  - You are about to drop the column `cta_badge` on the `SiteSettings` table. All the data in the column will be lost.
  - You are about to drop the column `cta_primary_link` on the `SiteSettings` table. All the data in the column will be lost.
  - You are about to drop the column `cta_primary_text` on the `SiteSettings` table. All the data in the column will be lost.
  - You are about to drop the column `cta_secondary_link` on the `SiteSettings` table. All the data in the column will be lost.
  - You are about to drop the column `cta_secondary_text` on the `SiteSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SiteSettings" DROP COLUMN "cta_badge",
DROP COLUMN "cta_primary_link",
DROP COLUMN "cta_primary_text",
DROP COLUMN "cta_secondary_link",
DROP COLUMN "cta_secondary_text",
ADD COLUMN     "cta_image_url" TEXT,
ADD COLUMN     "cta_primary_href" TEXT,
ADD COLUMN     "cta_primary_label" TEXT;
