const express = require("express");
const router = express.Router();
const prisma = require("../prisma/client");
const jwt = require("jsonwebtoken");

// Middleware: Only admins allowed
function adminOnly(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Missing token" });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey");
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// Get all pending users
router.get("/pending-users", adminOnly, async (req, res) => {
  const users = await prisma.user.findMany({
    where: { isApproved: false },
  });
  res.json(users);
});

// Approve user
router.put("/approve/:id", adminOnly, async (req, res) => {
  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { isApproved: true },
  });
  res.json({ message: "User approved", user });
});

// Reject (Delete) user
router.delete("/reject/:id", adminOnly, async (req, res) => {
  await prisma.user.delete({ where: { id: req.params.id } });
  res.json({ message: "User removed" });
});

module.exports = router;
