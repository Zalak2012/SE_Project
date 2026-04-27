const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { createRecord, getRecordsByPatient, getRecords } = require("../controllers/medicalRecordController");

router.post("/", protect, createRecord);
router.get("/", protect, getRecords);
router.get("/patient/:patientId", protect, getRecordsByPatient);

module.exports = router;
