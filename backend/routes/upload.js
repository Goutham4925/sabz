// routes/upload.js
const express = require("express");
const multer = require("multer");
const { Readable } = require("stream");
const { v4: uuid } = require("uuid");
const cloudinary = require("cloudinary").v2;

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
const storage = multer.memoryStorage();
const upload = multer({ storage });

// -------------------------------
// Helper: Upload buffer to Cloudinary
// -------------------------------
function uploadToCloudinary(buffer, folder = "gobbly_treat") {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: uuid(),
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
function extractPublicId(imageUrl) {
  if (!imageUrl) return null;

  try {
    const parts = imageUrl.split("/");
    const filename = parts.pop(); // name.ext
    const folder = parts.pop(); // folder name
    return `${folder}/${filename.split(".")[0]}`;
  } catch {
    return null;
  }
}

/* ============================================================
   1️⃣ UPLOAD MAIN IMAGE (and delete old one)
   POST /api/upload
   field: image
   optional body: oldImage
============================================================ */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: "No file uploaded" });

    // Upload new image to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer);

    // Delete old image if requested
    if (req.body.oldImage) {
      try {
        const publicId = extractPublicId(req.body.oldImage);
        if (publicId) await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.log("Error deleting old Cloudinary image:", err);
      }
    }

    return res.json({
      url: result.secure_url,
      relative: result.secure_url, // kept for compatibility
      filename: result.public_id,  // Cloudinary ID saved as filename
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

/* ============================================================
   2️⃣ UPLOAD GALLERY IMAGE (no delete)
   POST /api/upload/gallery
============================================================ */
router.post("/gallery", upload.single("image"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: "No file uploaded" });

    const result = await uploadToCloudinary(req.file.buffer, "gobbly_gallery");

    return res.json({
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
   3️⃣ DELETE IMAGE (Cloudinary version)
   DELETE /api/upload/file?filename=<public_id>
============================================================ */
router.delete("/file", async (req, res) => {
  try {
    const publicId = req.query.filename;

    if (!publicId)
      return res.status(400).json({ error: "filename (public_id) missing" });

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === "not found") {
      return res.status(404).json({ error: "File not found on Cloudinary" });
    }

    res.json({ success: true, deleted: publicId });
  } catch (err) {
    console.error("DELETE FILE ERROR:", err);
    res.status(500).json({ error: "Failed to delete file" });
  }
});

module.exports = router;
