import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef();

  const [auth, setAuth] = useState({
    isAdmin: false,
    isEmployee: false,
    user: null,
  });

  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

const syncAuth = () => {
  const adminToken = localStorage.getItem("adminToken");
  const employeeToken = localStorage.getItem("employeeToken");

  let adminUser = null;
  let employeeUser = null;

  try {
    adminUser = JSON.parse(localStorage.getItem("adminUser"));
    employeeUser = JSON.parse(localStorage.getItem("employeeUser"));
  } catch {
    adminUser = null;
    employeeUser = null;
  }

  setAuth({
    isAdmin: !!adminToken,
    isEmployee: !!employeeToken,
    user: adminToken ? adminUser : employeeUser,
  });
};


  useEffect(() => {
    syncAuth();

    const handleAuthChange = () => {
      syncAuth();
    }
    window.addEventListener("authChanged", handleAuthChange);
    return () => {
      window.removeEventListener("authChanged", handleAuthChange);
    };
  }, []);

const handleLogout = () => {
  const wasAdmin = localStorage.getItem("adminToken");

  localStorage.clear();
  window.dispatchEvent(new Event("authChanged"));
    alert("Logout successful 👋");

  navigate(wasAdmin ? "/admin/login" : "/login", { replace: true });
};



  const getInitials = () => {
    if (!auth.user) return "?";

    const name =
      auth.user.name ||
      auth.user.full_name ||
      auth.user.username ||
      "";

    if (!name) return "?";

    const parts = name.trim().split(" ");
    return (
      parts[0]?.charAt(0).toUpperCase() +
      (parts[1]?.charAt(0).toUpperCase() || "")
    );
  };

  return (
    <nav className="navbar">
      <div className="nav-top">
        <div className="nav-logo">
          <Link to="/">Aadya Enterprises</Link>
        </div>

        <div
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span><span></span><span></span>
        </div>
      </div>

      <ul className={`nav-links ${menuOpen ? "show" : ""}`}>
        {auth.isEmployee && (
          <li><Link to="/employee/dashboard">Employee Dashboard</Link></li>
        )}

        {auth.isAdmin && (
          <li><Link to="/admin/dashboard">Admin Dashboard</Link></li>
        )}

        {(auth.isAdmin || auth.isEmployee) ? (
          <li className="profile-wrapper" ref={dropdownRef}>
            <div
              className="profile-avatar"
              onClick={() => setOpen(!open)}
            >
              {getInitials()}
            </div>

            {open && (
              <div className="dropdown-menu">
               <p className="user-role">
      {auth.isAdmin ? "Admin" : "Employee"}
    </p>

    <p className="user-name">
      {auth.user?.name || auth.user?.username}
    </p>
                <button className="logout" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </li>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
