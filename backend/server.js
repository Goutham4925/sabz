// backend/server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const settingsRoutes = require("./routes/settings");
const contactPageRoutes = require("./routes/contactPage");

const { verifyToken } = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 5000;

// ----------------------------
// MIDDLEWARES
// ----------------------------
app.use(
  cors({
    origin: "*", // allow frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

// ----------------------------
// PUBLIC ROUTES
// ----------------------------
app.use("/api/auth", authRoutes);

// ----------------------------
// PROTECTED ROUTES (Admin Only)
// ----------------------------
app.use("/api/products", productRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/about", require("./routes/about"));
app.use("/api/contact-page", contactPageRoutes); 
app.use("/api/messages", require("./routes/contactMessages"));

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
