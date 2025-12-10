// routes/upload.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Ensure uploads directory exists
const UPLOAD_DIR = path.join(__dirname, "..", "public", "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// -------------------------------
// STORAGE CONFIG
// -------------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const name = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, name + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/**
 * Helper: build absolute file URL from request (works with proxies)
 */
function buildFileUrl(req, filename) {
  // prefer x-forwarded-proto when behind proxies (e.g. Render)
  const proto = (req.headers["x-forwarded-proto"] || req.protocol || "http").split(",")[0].trim();
  const host = req.get("host");
  return `${proto}://${host}/uploads/${filename}`;
}

/* ============================================================
   1️⃣ UPLOAD MAIN PRODUCT IMAGE (with delete old)
   Endpoint: POST /api/upload
   form field: image
   optional body: oldImage (full URL or relative /uploads/filename)
============================================================ */
router.post("/", upload.single("image"), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const oldImage = req.body.oldImage;

    // Delete old main image if provided (accept full URL or just filename)
    if (oldImage) {
      try {
        const base = path.basename(oldImage);
        const filepath = path.join(UPLOAD_DIR, base);

        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
          console.log("Deleted old file:", filepath);
        }
      } catch (err) {
        console.log("Error deleting old image:", err);
      }
    }

    const fileUrl = buildFileUrl(req, req.file.filename);

    res.json({
      url: fileUrl,
      relative: `/uploads/${req.file.filename}`,
      filename: req.file.filename,
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

/* ============================================================
   2️⃣ UPLOAD GALLERY IMAGE (no old delete)
   Endpoint: POST /api/upload/gallery
   form field: image
============================================================ */
router.post("/gallery", upload.single("image"), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const fileUrl = buildFileUrl(req, req.file.filename);

    res.json({
      url: fileUrl,
      relative: `/uploads/${req.file.filename}`,
      filename: req.file.filename,
    });
  } catch (err) {
    console.error("GALLERY UPLOAD ERROR:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

/* ============================================================
   3️⃣ DELETE FILE FROM SERVER
   Endpoint: DELETE /api/upload/file?filename=<filename>
   Pass just the filename (not full URL), e.g. filename=167xxx.png
============================================================ */
router.delete("/file", async (req, res) => {
  try {
    const filename = req.query.filename;
    if (!filename) return res.status(400).json({ error: "Filename missing" });

    const filepath = path.join(UPLOAD_DIR, String(filename));

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
