import EmployeeSidebar from "../../components/EmployeeSidebar";
import "../../styles/EmployeeDashboard.css";
import { useEffect, useState } from "react";
import api from "../api/axios";

const EmployeeDashboard = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [tasks, setTasks] = useState([]);

  // 🔹 REAL LEAVES STATE
  const [leaves, setLeaves] = useState([]);
  const [leaveLoading, setLeaveLoading] = useState(true);

  

  // =========================
  // FETCH MY TASKS
  // =========================
  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks/my/all");
      if (res.data.success) {
        setTasks(res.data.data);
      }
    } catch (err) {
      console.error("Task fetch error", err);
    }
  };

  // =========================
  // FETCH MY LEAVES (REAL)
  // =========================
  const fetchMyLeaves = async () => {
  try {
    setLeaveLoading(true);

    const res = await api.get("/employee/getMyLeaves");
    console.log("Leaves API response:", res.data);

    if (res.data.success) {
      setLeaves(res.data.data);
    } else {
      setLeaves([]);
    }
  } catch (err) {
    console.error("Fetch my leaves error", err);
    setLeaves([]);
  } finally {
    setLeaveLoading(false);
  }
};

useEffect(() => {
  fetchMyLeaves();
  fetchAttendance();
}, []);


 useEffect(() => {
    if (activeSection === "task") fetchTasks();
    if (activeSection === "attendance") fetchAttendance();
  }, [activeSection]);



  // =========================
  // MARK TASK DONE
  // =========================
  const markDone = async (taskId) => {
    try {
      await api.put(`/tasks/${taskId}`, {
        status: "Completed",
      });

      fetchTasks();
      alert("✅ Task marked as completed");
    } catch (err) {
      console.error("Mark done error", err);
      alert("❌ Failed to update task");
    }
  };

// ================= ATTENDANCE =================
  const [attendance, setAttendance] = useState([]);

  const fetchAttendance = async () => {
    try {
      const res = await api.get("/employee/getMyAttendence");
      if (res.data.success) setAttendance(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckIn = async () => {
    try {
      await api.post("/employee/check-in");
      alert("✅ Checked In Successfully");
      fetchAttendance();
    } catch (err) {
      alert(err.response?.data?.message || "Check-in failed");
    }
  };

  const handleCheckOut = async () => {
    try {
      await api.put("/employee/check-out");
      alert("✅ Checked Out Successfully");
      fetchAttendance();
    } catch (err) {
      alert(err.response?.data?.message || "Check-out failed");
    }
  };



  return (
    <div className="emp-dashboard-layout">
      <EmployeeSidebar />

      <main className="emp-main-content">
        <header className="emp-header">
          <h1>Employee Dashboard</h1>
        </header>

        {/* ===================== STATS ===================== */}
        <div className="emp-stats-grid">
          <div
            className="emp-stat-card blue clickable"
            onClick={() => setActiveSection("attendance")}
          >
            <h3>Attendance</h3>
            <p>92%</p>
          </div>

          <div
            className="emp-stat-card gray clickable"
            onClick={() => setActiveSection("task")}
          >
            <h3>My Task</h3>
            <p>{tasks.length || "View"}</p>
          </div>

          <div className="emp-stat-card orange">
            <h3>Remaining Leaves</h3>
            <p>08</p>
          </div>

          <div className="emp-stat-card green">
            <h3>Next Pay Date</h3>
            <p>March 01</p>
          </div>
        </div>

       {/* ================= ATTENDANCE SECTION ================= */}
        {activeSection === "attendance" && (
          <div className="emp-table-container">
           <div className="table-header">
  <h2>Attendance History</h2>

  <div className="attendance-actions">
    <button className="checkin-btn" onClick={handleCheckIn}>
      Check In
    </button>

    <button className="checkout-btn" onClick={handleCheckOut}>
      Check Out
    </button>

    <button className="close-btn" onClick={() => setActiveSection(null)}>
      ✖
    </button>
  </div>
</div>

            <table className="emp-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Late / Half-Day</th>
                </tr>
              </thead>
              <tbody>
                {attendance.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="no-data">
                      No attendance found
                    </td>
                  </tr>
                ) : (
                  attendance.map((a, i) => (
                    <tr key={i}>
                      <td>{a.date}</td>
                      <td>{a.check_in || "-"}</td>
                      <td>{a.check_out || "-"}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            a.attendance_type === "Late"
                              ? "late"
                              : a.attendance_type === "Half Day"
                              ? "halfday"
                              : "present"
                          }`}
                        >
                          {a.attendance_type}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

     

        {/* ===================== TASK SECTION ===================== */}
{activeSection === "task" && (
  <div className="emp-table-container">
    <h2>My Tasks</h2>

    <table className="emp-table">
      <thead>
        <tr>
          <th>Task</th>
          <th>Status</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {tasks.length === 0 ? (
          <tr>
            <td colSpan="5" className="no-data">
              No tasks assigned
            </td>
          </tr>
        ) : (
          tasks.map((task) => (
            <tr key={task.id}>
              {/* TASK TITLE */}
              <td className="task-title">{task.task_title}</td>

              {/* STATUS */}
              <td>
                <span
                  className={`status-badge ${task.status.toLowerCase()}`}
                >
                  {task.status}
                </span>
              </td>

              {/* START DATE */}
              <td>
                {task.start_date
                  ? new Date(task.start_date)
                      .toISOString()
                      .split("T")[0]
                  : "-"}
              </td>

              {/* END DATE */}
              <td>
                {task.end_date
                  ? new Date(task.end_date)
                      .toISOString()
                      .split("T")[0]
                  : "-"}
              </td>

              {/* ACTION */}
              <td>
                {task.status === "Pending" ? (
                  <button
                    className="emp-task-done-btn"
                    onClick={() => markDone(task.id)}
                  >
                    Mark as Done
                  </button>
                ) : (
                  <span className="completed-text">Done</span>
                )}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
)}


{/* ===================== REAL LEAVE SECTION ===================== */}
<div className="emp-table-container">
  <h2>Recent Leave Requests</h2>

  <table className="emp-table">
    <thead>
      <tr>
        <th>Date</th>
        <th>Type</th>
        <th>Status</th>
      </tr>
    </thead>

    <tbody>
      {leaveLoading ? (
        <tr>
          <td colSpan="3" className="no-data">
            Loading...
          </td>
        </tr>
      ) : leaves.length === 0 ? (
        <tr>
          <td colSpan="3" className="no-data">
            No leave requests found
          </td>
        </tr>
      ) : (
        leaves.map((leave, index) => (
          <tr key={index}>
            {/* DATE */}
            <td>
              {new Date(leave.date).toISOString().split("T")[0]}
            </td>

            {/* TYPE */}
            <td>{leave.type}</td>

            {/* STATUS */}
            <td>
              <span
                className={`status-badge ${leave.status.toLowerCase()}`}
              >
                {leave.status}
              </span>
            </td>
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

export default EmployeeDashboard;
