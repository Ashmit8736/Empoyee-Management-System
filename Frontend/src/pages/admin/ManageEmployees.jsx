import React, { useEffect, useState, useRef } from "react";
import "../../styles/ManageEmployees.css";
import AdminSidebar from "../../components/AdminSidebar";
import api from "../api/axios";

const ManageEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [editEmployee, setEditEmployee] = useState(null);

  // 🔽 REF FOR EDIT FORM
  const editFormRef = useRef(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get("/employee/all");
        if (res.data.success) {
          setEmployees(res.data.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchEmployees();
  }, []);

  const handleEdit = (emp) => {
    setEditEmployee({
      id: emp.id,
      emp_code: emp.emp_code ?? "",
      department: emp.department ?? "",
      name: emp.name ?? "",
    });

    // 🔽 SCROLL AFTER STATE UPDATE
    setTimeout(() => {
      editFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const { id, emp_code, department } = editEmployee;

      const res = await api.put(`/employee/update/${id}`, {
        emp_code,
        department,
      });

      if (res.data.success) {
        setEmployees((prev) =>
          prev.map((emp) =>
            emp.id === id ? { ...emp, emp_code, department } : emp
          )
        );
        setEditEmployee(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-dashboard-layout">
      <AdminSidebar />
      <main className="adm-main-content">
        <h2>Manage Employees</h2>

        <div className="adm-table-container">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Emp Code</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.emp_code}</td>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.department || "-"}</td>
                  <td>
                    <button
                      className="adm-edit-btn"
                      onClick={() => handleEdit(emp)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {editEmployee && (
          <div className="adm-edit-box" ref={editFormRef}>
            <h3>Edit Department</h3>

            <input
              name="emp_code"
              value={editEmployee.emp_code}
              onChange={handleChange}
              placeholder="Emp Code"
            />

            <input
              name="department"
              value={editEmployee.department}
              onChange={handleChange}
              placeholder="Department"
            />

            <button className="adm-edit-btn-update" onClick={handleUpdate}>Update</button>
            <button className="adm-edit-btn-cancel" onClick={() => setEditEmployee(null)}>Cancel</button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManageEmployees;
