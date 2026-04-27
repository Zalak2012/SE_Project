const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { fetchDashboardStats, fetchDoctorPatients, getDoctorProfile, updateDoctorProfile } = require("../controllers/doctorController");
const upload = require('../middleware/uploadDoctorImage');

router.get("/stats", protect, fetchDashboardStats);
router.get("/patients", protect, fetchDoctorPatients);
router.get("/me", protect, getDoctorProfile);
router.put("/profile", protect, upload.single('image'), updateDoctorProfile);

module.exports = router;
