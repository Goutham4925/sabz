// backend/server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const settingsRoutes = require("./routes/settings");
const contactPageRoutes = require("./routes/contactPage");
const { verifyAdmin } = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 5000;

// ----------------------------
// MIDDLEWARES
// ----------------------------
app.use(
  cors({
    origin: ["http://localhost:8080", "https://gobbly-treat.onrender.com"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);



// 🔥 THIS LINE HANDLES OPTIONS SAFELY (NO CRASH)
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static("public/uploads"));

// ----------------------------
// PUBLIC ROUTES
// ----------------------------
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", require("./routes/categories"));
app.use("/api/product-images", require("./routes/productImages"));
app.use("/api/upload", require("./routes/upload"));
app.use("/api/messages", require("./routes/contactMessages"));
app.use("/api/contact-page", contactPageRoutes);
app.use("/api/about", require("./routes/about"));
app.use("/api/settings", settingsRoutes);

// ----------------------------
// ADMIN-PROTECTED ROUTES
// ----------------------------
app.use("/api/admin", verifyAdmin, require("./routes/admin"));

// ----------------------------
// HEALTH CHECK
// ----------------------------
app.get("/", (req, res) => {
  res.send("Backend API is running");
});

// ----------------------------
// START SERVER
// ----------------------------
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
