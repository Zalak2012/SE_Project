const express = require("express");
const router = express.Router();

const { signupUser, loginUser, updateUserProfile, getUserById, getApprovedDoctors } = require("../controllers/userController");
const { getDoctorProfile, updateDoctorProfile } = require("../controllers/doctorController");
const { protect } = require("../middleware/authMiddleware");
const upload = require('../middleware/uploadDoctorImage');

router.post("/signup", signupUser);
router.post("/register", signupUser); // Alias
router.post("/login", loginUser);
router.post("/verify-email", require("../controllers/userController").verifyEmail);
router.post("/resend-otp", require("../controllers/userController").resendOTP);

// Use a combined profile update or doctor-specific if needed
// For now, let's use the requested doctor update for /api/doctors/profile
router.put("/profile", protect, updateUserProfile);
router.get("/me", protect, getDoctorProfile);

// Doctor listing routes
router.get("/", getApprovedDoctors); // Matches GET /api/doctors when mounted at /api/doctors
router.get("/doctors", getApprovedDoctors); // Matches GET /api/users/doctors when mounted at /api/users
router.get("/:id", getUserById);

module.exports = router;
