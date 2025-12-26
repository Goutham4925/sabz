// backend/server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

/* ----------------------------
   ROUTE IMPORTS
---------------------------- */
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const settingsRoutes = require("./routes/settings");
const contactPageRoutes = require("./routes/contactPage");
const categoriesRoutes = require("./routes/categories");
const productImagesRoutes = require("./routes/productImages");
const uploadRoutes = require("./routes/upload");
const contactMessagesRoutes = require("./routes/contactMessages");
const aboutRoutes = require("./routes/about");
const aboutTimelineRoutes = require("./routes/aboutTimeline");
const adminRoutes = require("./routes/admin");

const { verifyAdmin } = require("./middleware/auth");

/* ----------------------------
   APP INIT
---------------------------- */
const app = express();
const PORT = process.env.PORT || 5000;

/* ----------------------------
   CORS (FIXED & SAFE)
---------------------------- */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://saabz.netlify.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server, Postman, Render health checks
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // IMPORTANT: do NOT throw error
      return callback(null, false);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Explicit preflight handling (VERY IMPORTANT)
app.options("*", cors());

/* ----------------------------
   BODY PARSER
---------------------------- */
app.use(express.json());

/* ----------------------------
   STATIC FILES
---------------------------- */
app.use("/uploads", express.static("public/uploads"));

/* ----------------------------
   PUBLIC ROUTES
---------------------------- */
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/product-images", productImagesRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/messages", contactMessagesRoutes);
app.use("/api/contact-page", contactPageRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/about-timeline", aboutTimelineRoutes);

/* ----------------------------
   ADMIN ROUTES (PROTECTED)
---------------------------- */
app.use("/api/admin", verifyAdmin, adminRoutes);

/* ----------------------------
   HEALTH CHECK
---------------------------- */
app.get("/", (req, res) => {
  res.send("Backend API is running");
});

/* ----------------------------
   GLOBAL ERROR HANDLER
---------------------------- */
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

/* ----------------------------
   START SERVER
---------------------------- */
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
