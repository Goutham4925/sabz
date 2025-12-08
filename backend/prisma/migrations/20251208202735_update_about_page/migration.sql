/*
  Warnings:

  - You are about to drop the column `image_url` on the `AboutPage` table. All the data in the column will be lost.
  - You are about to drop the column `section1` on the `AboutPage` table. All the data in the column will be lost.
  - You are about to drop the column `section2` on the `AboutPage` table. All the data in the column will be lost.
  - You are about to drop the column `subtitle` on the `AboutPage` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `AboutPage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AboutPage" DROP COLUMN "image_url",
DROP COLUMN "section1",
DROP COLUMN "section2",
DROP COLUMN "subtitle",
DROP COLUMN "title",
ADD COLUMN     "timeline_heading" TEXT,
ADD COLUMN     "timeline_subheading" TEXT;
