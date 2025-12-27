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
// CORS CONFIG (PRODUCTION SAFE)
// ----------------------------
const allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:5173",
  "https://saabz.onrender.com",
  "https://sabz-sage.vercel.app/"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow Postman / server-to-server
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);



// ----------------------------
// BODY PARSER
// ----------------------------
app.use(express.json());

// ----------------------------
// STATIC FILES
// ----------------------------
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
app.use("/api/about-timeline", require("./routes/aboutTimeline"));


// ----------------------------
// ADMIN ROUTES
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
  console.log(`Backend server running on port ${PORT}`);
});
