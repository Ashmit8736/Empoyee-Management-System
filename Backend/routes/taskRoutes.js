const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin, isEmployee } = require("../middleware/authMiddleware");
const adminController = require("../controllers/adminController");
const employeeController = require("../controllers/employeeController");

// ADMIN
router.post("/", verifyToken, isAdmin, adminController.createTask);
router.get("/:employeeId", verifyToken, isAdmin, adminController.getTasksByEmployee);

// EMPLOYEE
router.get("/my/all", verifyToken, isEmployee, employeeController.getMyTasks);
router.put("/:taskId", verifyToken, isEmployee, employeeController.updateTaskStatus);

module.exports = router;
