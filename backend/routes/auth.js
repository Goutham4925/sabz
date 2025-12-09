// backend/routes/auth.js
const express = require("express");
const router = express.Router();
const prisma = require("../prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// UNIVERSAL SIGNUP TOGGLE
const ALLOW_SIGNUP = true;  // <--- change to true to allow registering new users

// -----------------------------------------------------
// LOGIN
// -----------------------------------------------------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    if (!user.isApproved) {
      return res.status(403).json({ message: "Account pending approval" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });

  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
});

// -----------------------------------------------------
// REGISTER (RESPECTS ALLOW_SIGNUP)
// -----------------------------------------------------
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        role: "user",
        isApproved: false,
      },
    });

    return res.json({
      message: "Signup successful. Waiting for admin approval.",
      user: { id: user.id, email: user.email, isApproved: user.isApproved },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// -----------------------------------------------------
// AUTH VERIFY
// -----------------------------------------------------
router.get("/me", async (req, res) => {
  const auth = req.headers.authorization;

  if (!auth) return res.status(401).json({ message: "Missing token" });

  const token = auth.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.json(decoded);
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
});

module.exports = router;
