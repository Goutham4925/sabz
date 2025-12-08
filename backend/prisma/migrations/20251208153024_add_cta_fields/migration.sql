/*
  Warnings:

  - You are about to drop the column `cta_image_url` on the `SiteSettings` table. All the data in the column will be lost.
  - You are about to drop the column `cta_primary_href` on the `SiteSettings` table. All the data in the column will be lost.
  - You are about to drop the column `cta_primary_label` on the `SiteSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SiteSettings" DROP COLUMN "cta_image_url",
DROP COLUMN "cta_primary_href",
DROP COLUMN "cta_primary_label",
ADD COLUMN     "cta_badge" TEXT,
ADD COLUMN     "cta_primary_link" TEXT,
ADD COLUMN     "cta_primary_text" TEXT,
ADD COLUMN     "cta_secondary_link" TEXT,
ADD COLUMN     "cta_secondary_text" TEXT;
