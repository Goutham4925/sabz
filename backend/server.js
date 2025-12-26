// backend/server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

/* ----------------------------
   APP INIT
---------------------------- */
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ REQUIRED FOR RENDER
app.set("trust proxy", 1);

/* ----------------------------
   FORCE CORS (BULLETPROOF)
---------------------------- */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://saabz.netlify.app");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

/* ----------------------------
   BODY PARSER
---------------------------- */
app.use(express.json());

/* ----------------------------
   ROUTES
---------------------------- */
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/product-images", require("./routes/productImages"));
app.use("/api/upload", require("./routes/upload"));
app.use("/api/messages", require("./routes/contactMessages"));
app.use("/api/contact-page", require("./routes/contactPage"));
app.use("/api/about", require("./routes/about"));
app.use("/api/settings", require("./routes/settings"));
app.use("/api/about-timeline", require("./routes/aboutTimeline"));

const { verifyAdmin } = require("./middleware/auth");
app.use("/api/admin", verifyAdmin, require("./routes/admin"));

/* ----------------------------
   HEALTH CHECK
---------------------------- */
app.get("/", (req, res) => {
  res.send("Backend API is running");
});

/* ----------------------------
   ERROR HANDLER
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
