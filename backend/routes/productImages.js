// routes/productImages.js
const express = require("express");
const prisma = require("../prisma/client");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { Readable } = require("stream");

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
   MULTER: In-Memory Storage
============================================================= */
const upload = multer({ storage: multer.memoryStorage() });

/* =============================================================
   Helper: Upload buffer to Cloudinary (Promise wrapper)
============================================================= */
function uploadBufferToCloudinary(buffer, folder = "gobbly/gallery") {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );

    Readable.from(buffer).pipe(stream);
  });
}

/* =============================================================
   Helper: Extract Cloudinary public_id
============================================================= */
function getPublicId(url) {
  try {
    // Example:
    // .../upload/v123456/gobbly/gallery/abc123.png
    const afterUpload = url.split("/upload/")[1];
    const noExtension = afterUpload.split(".")[0];
    return noExtension; // -> gobbly/gallery/abc123
  } catch {
    return null;
  }
}

/* =============================================================
   1️⃣ UPLOAD GALLERY IMAGE FOR A PRODUCT
   POST /api/product-images/:productId
============================================================= */
router.post("/:productId", upload.single("image"), async (req, res) => {
  try {
    const productId = Number(req.params.productId);
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Upload to Cloudinary
    const result = await uploadBufferToCloudinary(req.file.buffer);

    // Save to DB
    const img = await prisma.productImage.create({
      data: {
        productId,
        url: result.secure_url,
      },
    });

    res.json(img);
  } catch (err) {
    console.error("POST /product-images error:", err);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

/* =============================================================
   2️⃣ DELETE PRODUCT GALLERY IMAGE
   DELETE /api/product-images/:imageId
============================================================= */
router.delete("/:imageId", async (req, res) => {
  try {
    const imageId = Number(req.params.imageId);

    const image = await prisma.productImage.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Extract Cloudinary public_id
    const publicId = getPublicId(image.url);

    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
      console.log("Deleted from Cloudinary:", publicId);
    }

    // Delete DB row
    await prisma.productImage.delete({ where: { id: imageId } });

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE /product-images error:", err);
    res.status(500).json({ error: "Failed to delete image" });
  }
});

module.exports = router;
