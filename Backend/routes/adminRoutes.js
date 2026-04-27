const express = require("express");
const router = express.Router();
const { protect, isAdmin } = require("../middleware/authMiddleware");
const {
  getPendingDoctors,
  getAllDoctors,
  approveDoctor,
  rejectDoctor,
  getApprovedDoctors,
  getDashboardStats,
  getAnalytics,
  getUsers,
  deleteUser,
  getAllAppointments,
  debugUsers
} = require("../controllers/adminController");

// Users management
router.get("/users", protect, isAdmin, getUsers);
router.delete("/users/:id", protect, isAdmin, deleteUser);

// Dashboard stats
router.get("/dashboard-stats", protect, isAdmin, getDashboardStats);

// All appointments (System-wide)
router.get("/appointments", protect, isAdmin, getAllAppointments);

// Pending doctors
router.get("/pending-doctors", protect, isAdmin, getPendingDoctors);

// All doctors
router.get("/all-doctors", protect, isAdmin, getAllDoctors);

// Approved doctors (Full list)
router.get("/approved-doctors", protect, isAdmin, getApprovedDoctors);

// Approval logic
router.put("/approve/:id", protect, isAdmin, approveDoctor);
router.put("/reject/:id", protect, isAdmin, rejectDoctor);

// Analytics
router.get("/analytics", protect, isAdmin, getAnalytics);

// DEBUG
router.get("/debug-users", protect, isAdmin, debugUsers);

module.exports = router;


