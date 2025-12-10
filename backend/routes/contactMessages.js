const express = require("express");
const prisma = require("../prisma/client");
const router = express.Router();

/* ============================================================
   POST — NEW CONTACT MESSAGE or PRODUCT ENQUIRY
============================================================ */
router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      subject,
      message,
      productId,      // NEW
    } = req.body;

    let enrichedSubject = subject;
    let enrichedMessage = message;
    let productName = null;

    // If enquiry contains a productId, pull its name
    if (productId) {
      const product = await prisma.product.findUnique({
        where: { id: Number(productId) }
      });

      if (product) {
        productName = product.name;

        // Auto-inject product info into message
        enrichedSubject = subject || `Enquiry about ${product.name}`;

        enrichedMessage =
          message ||
          `Customer has requested information about the product "${product.name}".`;
      }
    }

    const saved = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,       // NEW FIELD
        subject: enrichedSubject,
        message: enrichedMessage,
        productId: productId ? Number(productId) : null,
        productName,
      },
    });

    res.json({ success: true, message: "Message stored", saved });
  } catch (err) {
    console.error("Failed saving message:", err);
    res.status(500).json({ error: "Failed to save message" });
  }
});

/* ============================================================
   GET ALL MESSAGES (ADMIN)
============================================================ */
router.get("/", async (req, res) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed loading messages" });
  }
});

/* ============================================================
   DELETE MESSAGE
============================================================ */
router.delete("/:id", async (req, res) => {
  try {
    await prisma.contactMessage.delete({
      where: { id: Number(req.params.id) },
    });
    res.json({ success: true });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: "Failed to delete" });
  }
});

module.exports = router;
