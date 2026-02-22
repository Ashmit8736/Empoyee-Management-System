import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem("adminToken");
  const employeeToken = localStorage.getItem("employeeToken");

  // 🔥 ADMIN LOGGED IN → ADMIN TOKEN ALWAYS PREFERRED
  if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  }
  // ELSE EMPLOYEE
  else if (employeeToken) {
    config.headers.Authorization = `Bearer ${employeeToken}`;
  }

  return config;
});

export default api;
