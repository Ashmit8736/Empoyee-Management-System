import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import EmployeeLogin from "./pages/auth/EmployeeLogin";
import Signup from "./pages/auth/Signup";
import AdminLogin from "./pages/auth/AdminLogin";
import EmployeeDashboard from "./pages/emp/EmployeeDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageEmployees from "./pages/admin/ManageEmployees";
import Salary from "./pages/admin/Salary";
import MyProfile from "./pages/emp/MyProfile";
import ApplyLeave from "./pages/emp/ApplyLeave";
import SalaryHistory from "./pages/emp/SalaryHistory";

import AdminRoute from "./routes/AdminRoute";
import EmployeeRoute from "./routes/EmployeeRoute";
import ManageTasks from "./pages/admin/ManageTasks";
import "./App.css";


function App() {
  const isAdmin = localStorage.getItem("adminToken");
  const isEmployee = localStorage.getItem("employeeToken");
  return (
    <BrowserRouter>
    {(isAdmin || isEmployee) && <Navbar />}
      <Navbar />

      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<EmployeeLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Employee */}
        <Route path="/employee/dashboard" element={<EmployeeRoute><EmployeeDashboard /></EmployeeRoute>} />
        <Route path="/employee/profile" element={<EmployeeRoute><MyProfile /></EmployeeRoute>} />
        <Route path="/employee/apply-leave" element={<EmployeeRoute><ApplyLeave /></EmployeeRoute>} />
        <Route path="/employee/salary-history" element={<EmployeeRoute><SalaryHistory /></EmployeeRoute>} />
        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/manage-employees"
          element={
            <AdminRoute>
              <ManageEmployees />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/ManageTasks"
          element={
            <AdminRoute>
              <ManageTasks />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/salary"
          element={
            <AdminRoute>
              <Salary />
            </AdminRoute>
          }
        />

        <Route
  path="*"
  element={
    localStorage.getItem("adminToken") ? (
      <Navigate to="/admin/dashboard" replace />
    ) : localStorage.getItem("employeeToken") ? (
      <Navigate to="/employee/dashboard" replace />
    ) : (
      <Navigate to="/login" replace />
    )
  }
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
