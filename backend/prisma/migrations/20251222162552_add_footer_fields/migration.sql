-- AlterTable
ALTER TABLE "AboutPage" ADD COLUMN     "timeline_hidden" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN     "footer_email" TEXT,
ADD COLUMN     "footer_phone" TEXT,
ADD COLUMN     "privacy_policy" TEXT,
ADD COLUMN     "social_facebook" TEXT,
ADD COLUMN     "social_instagram" TEXT,
ADD COLUMN     "social_twitter" TEXT,
ADD COLUMN     "terms_conditions" TEXT;

-- CreateTable
CREATE TABLE "AboutTimeline" (
    "id" SERIAL NOT NULL,
    "year" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "aboutId" INTEGER NOT NULL,

    CONSTRAINT "AboutTimeline_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AboutTimeline_aboutId_order_idx" ON "AboutTimeline"("aboutId", "order");

-- AddForeignKey
ALTER TABLE "AboutTimeline" ADD CONSTRAINT "AboutTimeline_aboutId_fkey" FOREIGN KEY ("aboutId") REFERENCES "AboutPage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
