import EmployeeSidebar from "../../components/EmployeeSidebar";
import "../../styles/SalaryHistory.css";
import api from "../api/axios";
import { useState, useEffect } from "react";

const SalaryHistory = () => {

    const [salaries, setSalaries] = useState([]);

  useEffect(() => {
    api.get("/employee/salary-history").then((res) => {
      if (res.data.success) {
        setSalaries(res.data.data);
      }
    });
  }, []);

  return (
    <div className="emp-dashboard-layout">
      {/* Sidebar */}
      <EmployeeSidebar />

      {/* Main Content */}
      <main className="emp-main-content">
        <div className="salary-page">
          <div className="salary-card">
            <h2>Salary History</h2>

            <div className="salary-table-wrapper">
              <table className="salary-table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
          <tbody>
            {salaries.map((s, i) => (
              <tr key={i}>
                <td>{s.month}</td>
                <td>₹{s.amount}</td>
                <td>
                  <span
                    className={`salary-status ${
                      s.status === "Paid" ? "paid" : "pending"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
              </table>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default SalaryHistory;
