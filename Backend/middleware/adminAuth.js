const jwt = require("jsonwebtoken");
const db = require("../config/db");

const adminAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // 1️⃣ Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 2️⃣ Check token exists in DB
    const [rows] = await db.query(
      "SELECT * FROM adminverify WHERE admin_id = ? AND token = ?",
      [decoded.adminId, token]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Session expired" });
    }

    req.admin = decoded;
    next();

  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = adminAuth;
