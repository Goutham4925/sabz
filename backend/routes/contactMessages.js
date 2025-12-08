const express = require("express");
const prisma = require("../prisma/client");
const router = express.Router();

// POST contact form message
router.post("/", async (req, res) => {
  try {
    const msg = await prisma.contactMessage.create({
      data: req.body,
    });

    res.json({ success: true, message: "Message received", msg });
  } catch (err) {
    res.status(500).json({ error: "Failed to save message" });
  }
});

// Admin — Get all messages
router.get("/", async (req, res) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" }
    });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed loading messages" });
  }
});

module.exports = router;
