-- AlterTable
ALTER TABLE "ContactMessage" ADD COLUMN     "address" TEXT,
ADD COLUMN     "products" JSONB,
ALTER COLUMN "email" DROP NOT NULL;
