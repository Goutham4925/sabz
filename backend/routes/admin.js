// backend/routes/admin.js
const express = require("express");
const router = express.Router();
const prisma = require("../prisma/client");

// ---------------------------------------------
// GET ALL USERS
// ---------------------------------------------
router.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(users);
  } catch (err) {
    console.error("GET USERS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------------------------------
// APPROVE USER
// ---------------------------------------------
router.put("/approve/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // Prevent self-action (optional safety)
    if (req.user.id === userId) {
      return res.status(400).json({ message: "You cannot approve yourself." });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { isApproved: true },
    });

    res.json(user);
  } catch (err) {
    console.error("APPROVE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------------------------------
// REJECT USER (delete)
// ---------------------------------------------
router.delete("/reject/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // ❌ Prevent deleting yourself
    if (req.user.id === userId) {
      return res.status(400).json({ message: "You cannot reject yourself." });
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    res.json({ message: "User deleted" });
  } catch (err) {
    console.error("REJECT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------------------------------
// PROMOTE TO ADMIN
// ---------------------------------------------
router.put("/promote/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role: "admin" },
    });

    res.json(user);
  } catch (err) {
    console.error("PROMOTE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------------------------------
// DEMOTE ADMIN
// ---------------------------------------------
router.put("/demote/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // ❌ Prevent demoting yourself
    if (req.user.id === userId) {
      return res.status(400).json({ message: "You cannot demote yourself." });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role: "user" },
    });

    res.json(user);
  } catch (err) {
    console.error("DEMOTE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------------------------------
// DELETE USER
// ---------------------------------------------
router.delete("/delete/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // ❌ Prevent deleting your own account
    if (req.user.id === userId) {
      return res.status(400).json({ message: "You cannot delete your own admin account." });
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    res.json({ message: "User removed" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
