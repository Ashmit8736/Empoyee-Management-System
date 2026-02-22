import EmployeeSidebar from "../../components/EmployeeSidebar";
import "../../styles/ApplyLeave.css";
import api from "../api/axios";

const ApplyLeave = () => {
  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // Replace employee_id with logged-in employee ID from token or context
    const employee_id = 1; // Example, later replace with real logged-in ID

    const type = e.target[0].value;  // Leave type
    const date = e.target[1].value;  // Leave date

    const res = await api.post("/employee/apply-Leave", {
      employee_id,
      type,
      date,
    });

    alert(res.data.message); // Success message
    e.target.reset();        // Optional: reset form after submit
  } catch (err) {
    console.error("Error applying leave:", err.response?.data || err.message);
    alert(err.response?.data?.message || "Something went wrong!");
  }
};

  return (
    <div className="emp-dashboard-layout">
      {/* Sidebar */}
      <EmployeeSidebar />

      {/* Main Content */}
      <main className="emp-main-content">
        <div className="applyleave-page">
          <div className="applyleave-card">
            <h2>Apply Leave</h2>

            <form onSubmit={handleSubmit}>
              <label>Leave Type</label>
              <select>
                <option value="">Select Leave Type</option>
                <option>Sick Leave</option>
                <option>Casual Leave</option>
              </select>

              <label>Leave Date</label>
              <input type="date" />

              <button type="submit" className="submit-btn">
                Submit Leave
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ApplyLeave;
