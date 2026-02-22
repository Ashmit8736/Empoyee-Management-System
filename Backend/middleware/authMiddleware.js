const jwt = require("jsonwebtoken");

/**
 * =========================
 * VERIFY JWT TOKEN
 * =========================
 */
exports.verifyToken = (req, res, next) => {
  try {
    console.log("🔐 Auth Middleware Hit");

    const authHeader = req.headers.authorization;

    // ❌ No token sent
    if (!authHeader) {
      console.log("❌ No Authorization Header");
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    // Expected: "Bearer TOKEN"
    const parts = authHeader.split(" ");

    if (parts.length !== 2) {
      console.log("❌ Invalid token format");
      return res.status(401).json({
        success: false,
        message: "Token format invalid",
      });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      console.log("❌ Token malformatted");
      return res.status(401).json({
        success: false,
        message: "Token malformatted",
      });
    }

    // ✅ Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log("❌ Token verification failed:", err.message);
        return res.status(401).json({
          success: false,
          message: "Invalid or expired token",
        });
      }

      console.log("✅ Token verified:", decoded);

      // decoded = { id, role, iat, exp }
      req.user = decoded;

      next(); // 🔥 MOST IMPORTANT (no buffering)
    });
  } catch (error) {
    console.error("❌ Auth Middleware Error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

/**
 * =========================
 * ADMIN ACCESS CHECK
 * =========================
 */
exports.isAdmin = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      console.log("⛔ Admin access denied");
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    next();
  } catch (error) {
    console.error("❌ isAdmin Middleware Error:", error);
    return res.status(500).json({
      success: false,
      message: "Authorization failed",
    });
  }
};
/**
 * =========================
 * EMPLOYEE ACCESS CHECK
 * =========================
 */
exports.isEmployee = (req, res, next) => {
  try {
    if (!req.user || (req.user.role !== "employee" && req.user.role !== "admin")) {
      console.log("⛔ Employee access denied");
      return res.status(403).json({
        success: false,
        message: "Employee access required",
      });
    }

    next();
  } catch (error) {
    console.error("❌ isEmployee Middleware Error:", error);
    return res.status(500).json({
      success: false,
      message: "Authorization failed",
    });
  }
};

