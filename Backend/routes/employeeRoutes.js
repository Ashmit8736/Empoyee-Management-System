const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin, isEmployee } = require("../middleware/authMiddleware");
const employeeController = require("../controllers/employeeController");
const adminController = require("../controllers/adminController");
const {
  getEmployees,
  updateEmployee,
  getProfile,
} = require("../controllers/employeeController");

router.get("/all", verifyToken, isAdmin, getEmployees);
router.put("/update/:id", verifyToken, isAdmin, updateEmployee);


router.get("/profile", verifyToken,isEmployee, employeeController.getProfile);
router.post("/apply-Leave",verifyToken, isEmployee, employeeController.applyLeave);
router.get("/getMyLeaves",verifyToken, isEmployee, employeeController.getMyLeaves);

// admin
router.get("/leaves/all", verifyToken, isAdmin, adminController.getAllLeaves);


// salary
router.get("/employeesAll", verifyToken, isAdmin, adminController.getEmployeesForSalary);
router.post("/addSalary", verifyToken, isAdmin, adminController.addSalary);
router.get("/salaries", verifyToken, isAdmin, adminController.getAllSalaries);

//employee salary history
router.get("/salary-history", verifyToken, isEmployee, employeeController.getMySalaryHistory);

//check in Check out
router.post("/check-in", verifyToken, isEmployee, employeeController.checkIn);
router.put("/check-out", verifyToken, isEmployee, employeeController.checkOut);
router.get("/getMyAttendence", verifyToken, isEmployee, employeeController.getMyAttendance);
//get employee attendance history by admin 
router.get("/attendance/all", verifyToken, isAdmin, employeeController.getAllAttendance);

//leave status update by admin
router.put("/:leaveId", verifyToken, isAdmin, adminController.updateLeaveStatus);


module.exports = router;
