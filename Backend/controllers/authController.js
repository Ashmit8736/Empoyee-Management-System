const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* =====================================================
   ====================== SIGNUP =======================
===================================================== */
exports.signup = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    if (!name || !email || !mobile || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check duplicate email
    const [exists] = await db.query(
      "SELECT id FROM employees WHERE email = ?",
      [email]
    );

    if (exists.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔢 AUTO emp_code generate
    const [countResult] = await db.query(
      "SELECT COUNT(*) as total FROM employees"
    );

    const empCode = `EMP${String(countResult[0].total + 1).padStart(3, "0")}`;

    // ✅ INSERT WITH emp_code
    await db.query(
      `INSERT INTO employees (name, email, mobile, password, emp_code)
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, mobile, hashedPassword, empCode]
    );

    res.status(201).json({
      success: true,
      message: "Signup successful",
    });

  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


/* =====================================================
   ======================= LOGIN =======================
===================================================== */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("📥 Login Request:", email);

    const [results] = await db.query(
      `
      SELECT id, name, email, password, 'employee' AS role FROM employees WHERE email = ?
      UNION
      SELECT id, name, email, password, 'admin' AS role FROM admins WHERE email = ?
      `,
      [email, email]
    );

    if (!results.length) {
      console.log("❌ User not found:", email);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = results[0];

    // Password check
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Invalid password:", email);
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("✅ Login successful:", user.role, user.id);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("🔥 Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
//Logout is handled on frontend by simply deleting the token. For enhanced security, we can implement token blacklisting or a token revocation mechanism in the future.

exports.logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(400).json({
        success: false,
        message: "Token missing",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔐 Only admin tokens are stored
    if (decoded.role === "admin") {
      await db.query(
        "DELETE FROM adminverify WHERE admin_id = ? AND token = ?",
        [decoded.id, token]
      );
    }

    console.log("🚪 Logout successful:", decoded.role, decoded.id);

    res.json({
      success: true,
      message: "Logout successful",
    });

  } catch (error) {
    console.error("🔥 Logout Error:", error);
    res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};