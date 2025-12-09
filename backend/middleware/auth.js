const jwt = require("jsonwebtoken");
const prisma = require("../prisma/client");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// --------------------------
// VERIFY TOKEN (adds req.user)
// --------------------------
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // attach info
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// --------------------------
// VERIFY ADMIN (checks DB)
// --------------------------
const verifyAdmin = async (req, res, next) => {
  verifyToken(req, res, async () => {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user)
      return res.status(401).json({ message: "User not found" });

    if (!user.isApproved)
      return res.status(403).json({ message: "Account not approved" });

    if (user.role !== "admin")
      return res.status(403).json({ message: "Admin only" });

    next();
  });
};

module.exports = { verifyToken, verifyAdmin };
