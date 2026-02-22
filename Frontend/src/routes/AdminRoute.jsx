import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
const token = localStorage.getItem("adminToken");
const user = JSON.parse(localStorage.getItem("adminUser"));

  // Not logged in
 if (!token || !user) {
    return <Navigate to="/admin/login" />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/login" />;
  }

  return children;
};

export default AdminRoute;
