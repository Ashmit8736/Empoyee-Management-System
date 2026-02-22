
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import "../../styles/Auth.css";

const EmployeeLogin = () => {
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

      if (user.role !== "employee") {
        alert("This is Employee Login only");
        return;
      }

      // ✅ EMPLOYEE SESSION STORE
      localStorage.setItem("employeeToken", res.data.token);
      localStorage.setItem("employeeUser", JSON.stringify(user));

      window.dispatchEvent(new Event("authChanged"));
      alert("Login successful ✅");

      navigate("/employee/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Employee Login</h2>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
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

        <p>
          New Employee? <Link to="/signup">Signup</Link>
        </p>

        <p className="admin-link">
          <Link to="/admin/login">Admin Login</Link>
        </p>
      </div>
    </div>
  );
};

export default EmployeeLogin;
