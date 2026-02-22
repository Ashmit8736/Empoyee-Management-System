import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/EmployeeSidebar.css";

const EmployeeSidebar = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({ name: "", role: "Employee" });

  // Sync employee info from localStorage
const syncEmployee = () => {
  const token = localStorage.getItem("employeeToken");

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("employeeUser"));
  } catch {
    user = null;
  }

  if (token && user) {
    setEmployee({ name: user.name, role: "Employee" });
  } else {
    setEmployee({ name: "", role: "" });
    navigate("/login", { replace: true });
  }
};


  useEffect(() => {
    syncEmployee();
    window.addEventListener("storage", syncEmployee);
    return () => window.removeEventListener("storage", syncEmployee);
  }, []);

  const handleLogout = () => {
  localStorage.removeItem("employeeToken");
  localStorage.removeItem("employeeUser");

  // 🔥 Navbar ko notify karo
  window.dispatchEvent(new Event("authChanged"));
    alert("Logout successful 👋");

  navigate("/login", { replace: true });
};


  const getInitials = () => {
    if (!employee.name) return "?";
    const parts = employee.name.trim().split(" ");
    return parts[0]?.charAt(0).toUpperCase() + (parts[1]?.charAt(0).toUpperCase() || "");
  };

  return (
    <aside className="emp-sidebar">
      <div className="profile-section">
        <div className="avatar">{getInitials()}</div>
        <p>{employee.name || "Employee"}</p>
        <span>{employee.role}</span>
      </div>

      <ul className="emp-nav-links">
        <li><NavLink to="/employee/dashboard">Dashboard</NavLink></li>
        <li><NavLink to="/employee/profile">My Profile</NavLink></li>
        <li><NavLink to="/employee/apply-leave">Apply Leave</NavLink></li>
        <li><NavLink to="/employee/salary-history">Salary History</NavLink></li>
      </ul>

      <button className="emp-logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
};

export default EmployeeSidebar;
