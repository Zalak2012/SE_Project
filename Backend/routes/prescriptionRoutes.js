const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { createPrescription, getPrescriptionsByPatient } = require("../controllers/prescriptionController");

router.post("/", protect, createPrescription);
router.get("/patient/:patientId", protect, getPrescriptionsByPatient);

module.exports = router;
