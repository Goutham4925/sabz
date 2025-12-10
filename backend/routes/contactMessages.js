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
      productId,
    } = req.body;

    let enrichedSubject = subject;
    let enrichedMessage = message;
    let productName = null;

    // If enquiry contains a productId → fetch product name
    if (productId) {
      const product = await prisma.product.findUnique({
        where: { id: Number(productId) },
      });

      if (product) {
        productName = product.name;

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
        phone: phone || null,
        subject: enrichedSubject,
        message: enrichedMessage,
        productId: productId ? Number(productId) : null,
        productName,
        is_read: false, // ensure new messages default to unread
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
    console.error("Load messages error:", err);
    res.status(500).json({ error: "Failed loading messages" });
  }
});

/* ============================================================
   MARK MESSAGE AS READ
============================================================ */
router.put("/:id/read", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { is_read: true },
    });

    res.json({ success: true, updated });
  } catch (err) {
    console.error("Mark read error:", err);
    res.status(500).json({ error: "Failed to mark as read" });
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
