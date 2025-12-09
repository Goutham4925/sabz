// routes/upload.js
const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;

  res.json({
    url: fileUrl,          // ← return FULL path
    relative: `/uploads/${req.file.filename}` // ← optional
  });
});

module.exports = router;
