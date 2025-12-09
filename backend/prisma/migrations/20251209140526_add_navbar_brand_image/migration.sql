-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN     "navbar_brand_image" TEXT,
ADD COLUMN     "show_company_text" BOOLEAN NOT NULL DEFAULT true;
