import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/AdminSidebar.css";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState({ name: "", role: "Admin" });

  // Sync admin info from localStorage
const syncAdmin = () => {
  const token = localStorage.getItem("adminToken");

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("adminUser"));
  } catch {
    user = null;
  }

  if (token && user) {
    setAdmin({ name: user.name, role: "Admin" });
  } else {
    setAdmin({ name: "", role: "" });
    navigate("/admin/login", { replace: true });
  }
};


  useEffect(() => {
    syncAdmin();
    window.addEventListener("storage", syncAdmin);
    return () => window.removeEventListener("storage", syncAdmin);
  }, []);

const handleLogout = () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminUser");

  // 🔥 Navbar ko notify karo
  window.dispatchEvent(new Event("authChanged"));
    alert("Logout successful 👋");

  navigate("/admin/login", { replace: true });
};


  const getInitials = () => {
    if (!admin.name) return "?";
    const parts = admin.name.trim().split(" ");
    return parts[0]?.charAt(0).toUpperCase() + (parts[1]?.charAt(0).toUpperCase() || "");
  };

  return (
    <aside className="adm-sidebar">
      <div className="profile-section">
        <div className="avatar">{getInitials()}</div>
        <p>{admin.name || "Admin"}</p>
        <span>{admin.role}</span>
      </div>

      <ul className="adm-nav-links">
        <li><NavLink to="/admin/dashboard">Dashboard</NavLink></li>
        <li><NavLink to="/admin/manage-employees">Manage employee</NavLink></li>
        <li><NavLink to="/admin/ManageTasks">Manage Tasks</NavLink></li>
        <li><NavLink to="/admin/salary">Salary</NavLink></li>
      </ul>

      <button className="adm-logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
};

export default AdminSidebar;
