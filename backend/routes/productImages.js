const express = require("express");
const prisma = require("../prisma/client");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Dynamic Base URL (Render / Production / Local)
const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

/* =============================================================
   MULTER STORAGE (public/uploads/)
=============================================================== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* =============================================================
   1️⃣ UPLOAD IMAGE FOR PRODUCT
   POST /api/product-images/:productId
=============================================================== */
router.post("/:productId", upload.single("image"), async (req, res) => {
  try {
    const productId = Number(req.params.productId);

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileUrl = `${BASE_URL}/uploads/${req.file.filename}`;

    const img = await prisma.productImage.create({
      data: {
        productId,
        url: fileUrl,
      },
    });

    res.json(img);
  } catch (err) {
    console.error("POST /product-images error:", err);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

/* =============================================================
   2️⃣ DELETE PRODUCT IMAGE
   DELETE /api/product-images/:imageId
=============================================================== */
router.delete("/:imageId", async (req, res) => {
  try {
    const imageId = Number(req.params.imageId);

    const img = await prisma.productImage.findUnique({
      where: { id: imageId },
    });

    if (!img) {
      return res.status(404).json({ error: "Image not found" });
    }

    const filename = img.url.split("/uploads/")[1];
    const filepath = path.join("public/uploads", filename);

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      console.log("Deleted image file:", filepath);
    }

    await prisma.productImage.delete({ where: { id: imageId } });

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE /product-images error:", err);
    res.status(500).json({ error: "Failed to delete image" });
  }
});

module.exports = router;
