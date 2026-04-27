const express = require("express");
const router = express.Router();
const { protect, isAdmin } = require("../middleware/authMiddleware");
const {
  getPendingDoctors,
  approveDoctor,
  rejectDoctor,
  getApprovedDoctors,
  getDashboardStats,
  getAnalytics,
  getUsers,
  debugUsers
} = require("../controllers/adminController");
const { getActivities } = require("../controllers/activityController");

// Users management
router.get("/users", protect, isAdmin, getUsers);

// Dashboard stats
router.get("/dashboard-stats", protect, isAdmin, getDashboardStats);

// Recent activity
router.get("/activities", protect, isAdmin, getActivities);

// Pending doctors
router.get("/pending-doctors", protect, isAdmin, getPendingDoctors);

// Approved doctors (Full list)
router.get("/approved-doctors", protect, isAdmin, getApprovedDoctors);

// Approval logic (Phases 10, 18, 19)
router.put("/approve/:id", protect, isAdmin, approveDoctor);
router.put("/reject/:id", protect, isAdmin, rejectDoctor);


// Analytics
router.get("/analytics", protect, isAdmin, getAnalytics);

// DEBUG
router.get("/debug-users", protect, isAdmin, debugUsers);

module.exports = router;


