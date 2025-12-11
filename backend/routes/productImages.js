// routes/productImages.js
const express = require("express");
const prisma = require("../prisma/client");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");

require("dotenv").config();

const router = express.Router();

/* =============================================================
   CLOUDINARY CONFIG
============================================================= */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* =============================================================
   MULTER: TEMP STORAGE ONLY (memory)
============================================================= */
const storage = multer.memoryStorage();
const upload = multer({ storage });

/* Helper: extract Cloudinary public_id from URL */
function getPublicIdFromUrl(url) {
  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;
    const filePart = parts[1].split(".")[0];
    return filePart;
  } catch {
    return null;
  }
}

/* =============================================================
   1️⃣ UPLOAD PRODUCT GALLERY IMAGE
   POST /api/product-images/:productId
============================================================= */
router.post("/:productId", upload.single("image"), async (req, res) => {
  try {
    const productId = Number(req.params.productId);
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // Upload buffer to Cloudinary
    const uploadResult = await cloudinary.uploader.upload_stream(
      { folder: "gobbly/gallery" },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return res.status(500).json({ error: "Upload failed" });
        }

        // Save URL to database
        const img = await prisma.productImage.create({
          data: {
            productId,
            url: result.secure_url,
          },
        });

        return res.json(img);
      }
    );

    uploadResult.end(req.file.buffer);
  } catch (err) {
    console.error("POST /product-images error:", err);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

/* =============================================================
   2️⃣ DELETE PRODUCT GALLERY IMAGE (Cloudinary + DB)
   DELETE /api/product-images/:imageId
============================================================= */
router.delete("/:imageId", async (req, res) => {
  try {
    const imageId = Number(req.params.imageId);

    const img = await prisma.productImage.findUnique({
      where: { id: imageId },
    });

    if (!img) return res.status(404).json({ error: "Image not found" });

    // Extract Cloudinary public_id
    const publicId = getPublicIdFromUrl(img.url);

    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
      console.log("Cloudinary image deleted:", publicId);
    }

    // Delete database record
    await prisma.productImage.delete({ where: { id: imageId } });

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE /product-images error:", err);
    res.status(500).json({ error: "Failed to delete image" });
  }
});

module.exports = router;
