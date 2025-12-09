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
    const user = await prisma.user.update({
      where: { id: req.params.id },  // <-- STRING ID
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
    await prisma.user.delete({
      where: { id: req.params.id },
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
    const user = await prisma.user.update({
      where: { id: req.params.id },
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
    const user = await prisma.user.update({
      where: { id: req.params.id },
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
    await prisma.user.delete({
      where: { id: req.params.id },
    });
    res.json({ message: "User removed" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
