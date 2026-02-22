import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import "../../styles/Auth.css";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", { email, password });

      if (!res.data.success) {
        alert("Login failed");
        return;
      }

      const user = res.data.user;

      if (user.role !== "admin") {
        alert("This is Admin Login only");
        return;
      }

// ✅ ADMIN SESSION STORE
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("adminUser", JSON.stringify(user));

          // 🔥 TELL NAVBAR AUTH CHANGED
    window.dispatchEvent(new Event("authChanged"));
    alert("Admin login successful ✅");

      navigate("/admin/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Admin Login</h2>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Admin Email</label>
            <input
              type="email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="auth-btn" type="submit">
            Login
          </button>
        </form>

        <p className="admin-link">
          <Link to="/login">Employee Login</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
