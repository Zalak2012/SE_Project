const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { createRecord, getRecordsByPatient, getDoctorRecords } = require("../controllers/medicalRecordController");

router.post("/", protect, createRecord);
router.get("/", protect, getDoctorRecords);
router.get("/patient/:patientId", protect, getRecordsByPatient);

module.exports = router;
