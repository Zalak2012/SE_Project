const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  getAppointments,
  createAppointment,
  updateAppointmentStatus
} = require("../controllers/appointmentController");

router.get("/", protect, getAppointments);
router.post("/", protect, createAppointment);
router.put("/:id", protect, updateAppointmentStatus);

module.exports = router;
