import React, { useEffect, useState } from "react";
import "../../styles/Salary.css";
import AdminSidebar from "../../components/AdminSidebar";
import api from "../api/axios";

const Salary = () => {
  const [employees, setEmployees] = useState([]);
  const [salaries, setSalaries] = useState([]);

  const [form, setForm] = useState({
    employee_id: "",
    month: "",
    amount: "",
    status: "Pending",
  });

  // =========================
  // GET EMPLOYEES (ADMIN)
  // =========================
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get("/employee/employeesAll");
        if (res.data.success) {
          setEmployees(res.data.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchEmployees();
  }, []);

  // =========================
  // ADD SALARY
  // =========================
  const handleSubmit = async () => {
    if (!form.employee_id || !form.month || !form.amount) {
      alert("All fields required");
      return;
    }

    try {
      const res = await api.post("/employee/addSalary", form);  

      if (res.data.success) {
        alert("Salary added successfully");

      const salaryRes = await api.get("/employee/salaries");
      if (salaryRes.data.success) {
        setSalaries(salaryRes.data.data);
      }

        setForm({
          employee_id: "",
          month: "",
          amount: "",
          status: "Pending",
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  //get salary after post then show in table
  useEffect(() => {
  const fetchSalaries = async () => {
    try {
      const res = await api.get("/employee/salaries");
      if (res.data.success) {
        setSalaries(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  fetchSalaries();
}, []);


  return (
    <div className="admin-dashboard-layout">
      <AdminSidebar />

      <main className="adm-main-content">
        <header>
          <h2>Salary Management</h2>
        </header>

        {/* =======================
            ADD SALARY FORM
        ======================= */}
        <div className="salary-form">
          <select
            value={form.employee_id}
            onChange={(e) =>
              setForm({ ...form, employee_id: e.target.value })
            }
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.emp_code} - {emp.name}
              </option>
            ))}
          </select>

          {/* <input
            type="text"
            placeholder="Month (e.g. January)"
            value={form.month}
            onChange={(e) =>
              setForm({ ...form, month: e.target.value })
            }
          /> */}

          <select
            value={form.month}
            onChange={(e) =>
              setForm({ ...form, month: e.target.value })
            }
          >
            <option value="">Select Month</option>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </select>

          <input
            type="number"
            placeholder="Salary Amount"
            value={form.amount}
            onChange={(e) =>
              setForm({ ...form, amount: e.target.value })
            }
          />

          <select
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value })
            }
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
          </select>

          <button onClick={handleSubmit}>Add Salary</button>
        </div>

        {/* =======================
            SALARY TABLE
        ======================= */}
        <div className="adm-table-container">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Emp ID</th>
                <th>Name</th>
                <th>Salary (₹)</th>
              </tr>
            </thead>

            <tbody>
              {salaries.length === 0 ? (
    <tr>
      <td colSpan="3" style={{ textAlign: "center" }}>
        No salary records
      </td>
    </tr>
  ) : (
    salaries.map((s) => (
      <tr key={s.id}>
        <td>{s.emp_code}</td>
        <td>{s.name}</td>
        <td>₹{s.amount}</td>
      </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Salary;
