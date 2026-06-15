const express = require("express");
const prisma = require("../prisma/client");
const { sendEnquiryMail } = require("../utils/mailer");
const router = express.Router();

/* ============================================================
   POST — CONTACT MESSAGE / PRODUCT ENQUIRY / CART ENQUIRY
============================================================ */
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, subject, message, productId, address, products } = req.body;

    let enrichedSubject = subject;
    let enrichedMessage = message;
    let productName = null;

    // Cart enquiry — multiple products
    if (Array.isArray(products) && products.length > 0) {
      const lines = products.map(
        (p) =>
          `• ${p.name}${p.quantity > 1 ? ` × ${p.quantity}` : ""}${
            p.price ? ` — ₹${(p.price * p.quantity).toFixed(2)}` : ""
          }`
      );
      enrichedSubject =
        subject || `Cart Enquiry — ${products.length} product(s)`;
      enrichedMessage = [
        "Products requested:",
        ...lines,
        "",
        address ? `Delivery address: ${address}` : "",
        message ? `Note: ${message}` : "",
      ]
        .filter((l) => l !== undefined)
        .join("\n")
        .trim();
    } else if (productId) {
      // Single product enquiry
      const product = await prisma.product.findUnique({
        where: { id: Number(productId) },
        select: { name: true },
      });

      if (product) {
        productName = product.name;
        enrichedSubject = subject || `Enquiry about ${product.name}`;
        enrichedMessage =
          message ||
          `Customer requested information about "${product.name}".`;
      }
    }

    const saved = await prisma.contactMessage.create({
      data: {
        name,
        email: email || null,
        phone: phone || null,
        subject: enrichedSubject,
        message: enrichedMessage,
        productId: productId ? Number(productId) : null,
        productName,
        address: address || null,
        products: Array.isArray(products) && products.length > 0 ? products : undefined,
        is_read: false,
      },
    });

    // Fire email — non-blocking so slow SMTP doesn't delay response
    sendEnquiryMail({
      name,
      email,
      phone,
      address,
      subject: enrichedSubject,
      message: enrichedMessage,
      products: Array.isArray(products) && products.length > 0 ? products : null,
    }).catch((err) => console.error("Mail send error:", err.message, err.code, err.response));

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
    const updated = await prisma.contactMessage.update({
      where: { id: Number(req.params.id) },
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
