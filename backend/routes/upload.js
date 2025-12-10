const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// -------------------------------
// STORAGE CONFIG
// -------------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

/* ============================================================
   1️⃣ UPLOAD MAIN PRODUCT IMAGE (with delete old)
============================================================ */
router.post("/", upload.single("image"), (req, res) => {
  if (!req.file)
    return res.status(400).json({ error: "No file uploaded" });

  const oldImage = req.body.oldImage;

  // 🔥 Delete old main image if provided
  if (oldImage) {
    try {
      const filename = oldImage.split("/").pop();
      const filepath = path.join("public/uploads", filename);

      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
        console.log("Deleted old file:", filepath);
      }
    } catch (err) {
      console.log("Error deleting old image:", err);
    }
  }

  const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;

  res.json({
    url: fileUrl,
    relative: `/uploads/${req.file.filename}`,
  });
});

/* ============================================================
   2️⃣ UPLOAD GALLERY IMAGE (no old delete)
============================================================ */
router.post("/gallery", upload.single("image"), (req, res) => {
  if (!req.file)
    return res.status(400).json({ error: "No file uploaded" });

  const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;

  res.json({
    url: fileUrl,
    relative: `/uploads/${req.file.filename}`,
  });
});

/* ============================================================
   3️⃣ DELETE FILE FROM SERVER (optional but useful)
============================================================ */
router.delete("/file", async (req, res) => {
  try {
    const { filename } = req.query;
    if (!filename)
      return res.status(400).json({ error: "Filename missing" });

    const filepath = path.join("public/uploads", filename);

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      return res.json({ success: true, deleted: filename });
    }

    res.status(404).json({ error: "File not found" });
  } catch (err) {
    console.error("DELETE FILE ERROR:", err);
    res.status(500).json({ error: "Failed to delete file" });
  }
});

module.exports = router;
