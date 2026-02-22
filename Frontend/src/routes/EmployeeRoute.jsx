import { Navigate } from "react-router-dom";

const EmployeeRoute = ({ children }) => {
  const token = localStorage.getItem("employeeToken");
  const user = JSON.parse(localStorage.getItem("employeeUser"));

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "employee") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default EmployeeRoute;
