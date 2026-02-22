
import React, { useEffect, useRef, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import api from "../api/axios";
import "../../styles/ManageTasks.css";

const ManageTasks = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState("");

  const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");


  const taskSectionRef = useRef(null);

  useEffect(() => {
    api.get("/employee/all").then((res) => {
      if (res.data.success) {
        setEmployees(res.data.data);
      }
    });
  }, []);

  const openTaskSection = async (emp) => {
    setSelectedEmp(emp);
    const res = await api.get(`/tasks/${emp.id}`);
    setTasks(res.data.data || []);

    // 🔽 auto scroll
    setTimeout(() => {
      taskSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  const addTask = async () => {
    if (!taskText.trim()) return;

    await api.post("/tasks", {
      employee_id: selectedEmp.id,
      task_title: taskText,
      start_date: startDate,
      end_date: endDate,
    });

    const res = await api.get(`/tasks/${selectedEmp.id}`);
    setTasks(res.data.data || []);
    setTaskText("");
  };

  return (
    <div className="admin-dashboard-layout">
      <AdminSidebar />

      <main className="page">
        <h2>Task Management</h2>

        {/* EMPLOYEE TABLE */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Emp Code</th>
                <th>Name</th>
                <th>Action</th>
                
              </tr>
            </thead>

            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan="3" align="center">
                    No Employees Found
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.id}>
                    <td>{emp.emp_code}</td>
                    <td>{emp.name}</td>
                    <td>
                      <button
                        className="adm-edit-btn"
                        onClick={() => openTaskSection(emp)}
                      >
                        Manage Tasks
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ================= TASK SECTION ================= */}
       {selectedEmp && (
  <div ref={taskSectionRef} className="task-section">
    <div className="task-header">
      <h3>
        Tasks for {selectedEmp.emp_code} – {selectedEmp.name}
      </h3>

      {/* CLOSE BUTTON */}
      <button
        className="task-close-btn"
        onClick={() => {
          setSelectedEmp(null);
          setTasks([]);
        }}
      >
        ✕
      </button>
    </div>

    {/* ADD TASK FORM */}
    <div className="task-form">
      <input
        type="text"
        placeholder="Enter new task"
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
      />
      <input
    type="date"
    value={startDate}
    onChange={(e) => setStartDate(e.target.value)}
  />

  <input
    type="date"
    value={endDate}
    onChange={(e) => setEndDate(e.target.value)}
  />
      <button onClick={addTask}>Add Task</button>
    </div>

   
  



    {/* TASK TABLE */}
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Sr.No:</th>
            <th>Task</th>
            <th>Status</th>
            <th>Start Date</th>
            <th>End Date</th> 
          </tr>
        </thead>

        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td colSpan="5" align="center">
                No tasks assigned
              </td>
            </tr>
          ) : (
            tasks.map((t, index) => (
              <tr key={t.id}>
                <td>{index + 1}</td>
                <td>{t.task_title}</td>
                <td>
                  <span className={`status ${t.status?.toLowerCase()}`}>
                    {t.status || "Pending"}
                  </span>
                </td>
                <td>
              {t.start_date
                ? new Date(t.start_date).toISOString().split("T")[0]
                : "-"}
            </td>

            <td>
              {t.end_date
                ? new Date(t.end_date).toISOString().split("T")[0]
                : "-"}
            </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
)}

      </main>
    </div>
  );
};

export default ManageTasks;
