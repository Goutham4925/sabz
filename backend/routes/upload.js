const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  // -------- DELETE OLD IMAGE IF PROVIDED --------
  const oldImage = req.body.oldImage;
  if (oldImage) {
    try {
      // oldImage will be full URL → extract filename
      const filename = oldImage.split("/").pop();
      const filepath = path.join("public/uploads", filename);

      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
        console.log("Deleted previous file:", filepath);
      }
    } catch (err) {
      console.log("Failed to delete previous image:", err);
    }
  }

  // -------- RETURN NEW FILE URL --------
  const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;

  res.json({
    url: fileUrl,
    relative: `/uploads/${req.file.filename}`,
  });
});

module.exports = router;
