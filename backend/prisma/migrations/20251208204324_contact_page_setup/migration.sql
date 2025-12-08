-- CreateTable
CREATE TABLE "ContactPage" (
    "id" SERIAL NOT NULL,
    "hero_badge" TEXT,
    "hero_title" TEXT,
    "hero_subtitle" TEXT,
    "card_1_icon" TEXT,
    "card_1_title" TEXT,
    "card_1_line1" TEXT,
    "card_1_line2" TEXT,
    "card_2_icon" TEXT,
    "card_2_title" TEXT,
    "card_2_line1" TEXT,
    "card_2_line2" TEXT,
    "card_3_icon" TEXT,
    "card_3_title" TEXT,
    "card_3_line1" TEXT,
    "card_3_line2" TEXT,
    "card_4_icon" TEXT,
    "card_4_title" TEXT,
    "card_4_line1" TEXT,
    "card_4_line2" TEXT,
    "map_title" TEXT,
    "map_address" TEXT,
    "faq_1_q" TEXT,
    "faq_1_a" TEXT,
    "faq_2_q" TEXT,
    "faq_2_a" TEXT,
    "faq_3_q" TEXT,
    "faq_3_a" TEXT,
    "faq_4_q" TEXT,
    "faq_4_a" TEXT,

    CONSTRAINT "ContactPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);
