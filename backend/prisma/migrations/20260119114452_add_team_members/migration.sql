-- CreateTable
CREATE TABLE "TeamMember" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "image" TEXT,
    "order" INTEGER NOT NULL,
    "aboutId" INTEGER NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TeamMember_aboutId_order_idx" ON "TeamMember"("aboutId", "order");

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_aboutId_fkey" FOREIGN KEY ("aboutId") REFERENCES "AboutPage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
