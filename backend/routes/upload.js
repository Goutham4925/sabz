// routes/upload.js
const express = require("express");
const multer = require("multer");
const { Readable } = require("stream");
const cloudinary = require("cloudinary").v2;
const { randomUUID } = require("crypto");

const router = express.Router();

// -------------------------------
// CLOUDINARY CONFIG
// -------------------------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// -------------------------------
// MULTER — memory storage
// -------------------------------
const upload = multer({ storage: multer.memoryStorage() });

// -------------------------------
// Helper: Upload buffer to Cloudinary
// -------------------------------
function uploadToCloudinary(buffer, folder = "saabz_kitchen") {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: randomUUID(), // FIXED — built-in unique ID
        resource_type: "image",
      },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
}

// -------------------------------
// Helper: Extract Cloudinary public_id
// -------------------------------
function extractPublicId(url) {
  if (!url) return null;

  try {
    const parts = url.split("/");
    const filename = parts.pop(); // xx.png
    const folder = parts.pop();   
    return `${folder}/${filename.split(".")[0]}`;
  } catch {
    return null;
  }
}

/* ============================================================
   1️⃣ UPLOAD MAIN IMAGE (delete old)
============================================================ */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: "No file uploaded" });

    // Upload new
    const result = await uploadToCloudinary(req.file.buffer);

    // Delete old image if exists
    if (req.body.oldImage) {
      const publicId = extractPublicId(req.body.oldImage);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.log("Failed to delete old image:", err);
        }
      }
    }

    res.json({
      url: result.secure_url,
      relative: result.secure_url,
      filename: result.public_id,
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

/* ============================================================
   2️⃣ GALLERY UPLOAD (no delete)
============================================================ */
router.post("/gallery", upload.single("image"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: "No file uploaded" });

    const result = await uploadToCloudinary(req.file.buffer, "saabz_gallery");

    res.json({
      url: result.secure_url,
      relative: result.secure_url,
      filename: result.public_id,
    });
  } catch (err) {
    console.error("GALLERY UPLOAD ERROR:", err);
    res.status(500).json({ error: "Gallery upload failed" });
  }
});

/* ============================================================
   3️⃣ DELETE IMAGE BY public_id
============================================================ */
router.delete("/file", async (req, res) => {
  try {
    const publicId = req.query.filename;

    if (!publicId)
      return res.status(400).json({ error: "filename missing" });

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === "not found")
      return res.status(404).json({ error: "File not found" });

    res.json({ success: true, deleted: publicId });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: "Failed to delete file" });
  }
});

module.exports = router;
