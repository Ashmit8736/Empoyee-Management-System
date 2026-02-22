const db = require("../config/db");

/**
 * =========================
 * ADMIN : Get All Employees
 * =========================
 */
exports.getEmployees = async (req, res) => {
  try {
    const sql = `
      SELECT 
        id,
        name,
        email,
        emp_code,
        department
      FROM employees
      ORDER BY created_at DESC
    `;

    const [results] = await db.query(sql);

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (err) {
    console.error("Get Employees Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch employees",
    });
  }
};

/**
 * =======================================
 * ADMIN : Update Employee
 * =======================================
 */
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { emp_code, department, task } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Employee ID is required",
      });
    }

    if (!emp_code || !department) {
      return res.status(400).json({
        success: false,
        message: "emp_code and department are required",
      });
    }

    const sql = `
      UPDATE employees
      SET emp_code = ?, department = ?, task = ?, task_status = 'Pending'
      WHERE id = ?
    `;

    const [result] = await db.query(sql, [
      emp_code,
      department,
      task || null,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
    });
  } catch (err) {
    console.error("Update Employee Error:", err);

    // UNIQUE emp_code handling
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        success: false,
        message: "Employee code already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update employee",
    });
  }
};


/**
 * ==========================
 * EMPLOYEE : Get Own Profile
 * ==========================
 */
exports.getProfile = async (req, res) => {
  try {
    const employeeId = req.user?.id;

    if (!employeeId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const sql = `
      SELECT
        id,
        name,
        email,
        mobile,
        emp_code,
        department,
        created_at
      FROM employees
      WHERE id = ?
      LIMIT 1
    `;

    const [results] = await db.query(sql, [employeeId]);

    if (!results.length) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      data: results[0],
    });
  } catch (err) {
    console.error("Get Profile Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

// Apply Leave
exports.applyLeave = async (req, res) => {
  try {
    const employee_id = req.user.id;
    const { type, date } = req.body;

    if (!type || !date) {
      return res.status(400).json({ message: "All fields required" });
    }

    const sql = `
      INSERT INTO leaves (employee_id, type, date)
      VALUES (?, ?, ?)
    `;

    await db.query(sql, [employee_id, type, date]);

    res.status(201).json({ success: true, message: "Leave applied" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};


exports.getMyLeaves = async (req, res) => {
  try {
    const employee_id = req.user.id;

    const sql = `
      SELECT type, \`date\`, status, remark
      FROM leaves
      WHERE employee_id = ?
      ORDER BY created_at DESC
    `;

    const [rows] = await db.query(sql, [employee_id]);
       console.log("Leaves API data:", rows);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("Get my leaves error:", err);
    res.status(500).json({ success: false });
  }
};


// get employee task
exports.getMyTasks = async (req, res) => {
  try {
    const employeeId = req.user.id;

    const sql = `
      SELECT id, task_title, status, created_at,start_date,end_date
      FROM tasks
      WHERE employee_id = ?
      ORDER BY created_at DESC
    `;

    const [results] = await db.query(sql, [employeeId]);

    res.json({
      success: true,
      data: results,
    });
  } catch (err) {
    console.error("Get My Tasks Error:", err);
    res.status(500).json({ success: false });
  }
};

// task done
exports.updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    const allowedStatus = ["Pending", "In Progress", "Completed"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const sql = `
      UPDATE tasks
      SET status = ?
      WHERE id = ?
    `;

    const [result] = await db.query(sql, [status, taskId]);

    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.json({
      success: true,
      message: "Task status updated",
    });
  } catch (err) {
    console.error("Update Task Error:", err);
    res.status(500).json({ success: false });
  }
};

// GET /employee/salary-history
exports.getMySalaryHistory = async (req, res) => {
  try {
    const employeeId = req.user.id;

    const sql = `
      SELECT month, amount, status
      FROM salaries
      WHERE employee_id = ?
      ORDER BY created_at DESC
    `;

    const [rows] = await db.query(sql, [employeeId]);

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

//check in logic

exports.checkIn = async (req, res) => {
  try {
    const employee_id = req.user.id;
    const now = new Date();

    const today = now.toISOString().split("T")[0];
    const time = now.toTimeString().split(" ")[0]; // HH:MM:SS

    // ---------- TIME LOGIC ----------
    const hour = now.getHours();
    const minute = now.getMinutes();

    let attendanceType = "Present";

    if (hour > 11 || (hour === 11 && minute > 0)) {
      attendanceType = "Half Day";
    } else if (
      hour > 9 ||
      (hour === 9 && minute > 30)
    ) {
      attendanceType = "Late";
    }

    // ---------- CHECK DUPLICATE ----------
    const [existing] = await db.query(
      "SELECT id FROM attendance WHERE employee_id=? AND date=?",
      [employee_id, today]
    );

    if (existing.length > 0) {
      return res.json({
        success: false,
        message: "Already checked in today",
      });
    }

    // ---------- INSERT ----------
    await db.query(
      `INSERT INTO attendance 
       (employee_id, date, check_in, attendance_type) 
       VALUES (?,?,?,?)`,
      [employee_id, today, time, attendanceType]
    );

    res.json({
      success: true,
      message: "Check-in successful",
      attendanceType,
    });
  } catch (err) {
    console.error("Check-in error:", err);
    res.status(500).json({ success: false });
  }
};

// check out logic

exports.checkOut = async (req, res) => {
  try {
    const employee_id = req.user.id;
    const today = new Date().toISOString().split("T")[0];
    const time = new Date().toLocaleTimeString("en-GB");

    await db.query(
      "UPDATE attendance SET check_out=? WHERE employee_id=? AND date=?",
      [time, employee_id, today]
    );

    res.json({ success: true, message: "Check-out successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

// GET /employee/attendance

exports.getMyAttendance = async (req, res) => {
  try {
    const employee_id = req.user.id;

    const [rows] = await db.query(
      `SELECT 
        date,
        check_in,
        check_out,
        attendance_type
       FROM attendance
       WHERE employee_id=?
       ORDER BY date DESC`,
      [employee_id]
    );

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

/**
 * ============================
 * ADMIN : Get All Employee Attendance
 * ============================
 */
exports.getAllAttendance = async (req, res) => {
  try {
    const sql = `
      SELECT 
        e.id AS employee_id,
        e.emp_code,
        e.name,
        a.date,
        a.check_in,
        a.check_out,
        a.attendance_type
      FROM employees e
      LEFT JOIN attendance a
        ON e.id = a.employee_id
      ORDER BY a.date DESC, e.id ASC
    `;

    const [rows] = await db.query(sql);

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (err) {
    console.error("Get all attendance error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch attendance",
    });
  }
};

