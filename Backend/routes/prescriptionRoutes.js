const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { createPrescription, getPrescriptionsByPatient, getPrescriptions } = require("../controllers/prescriptionController");

router.post("/", protect, createPrescription);
router.get("/", protect, getPrescriptions);
router.get("/patient/:patientId", protect, getPrescriptionsByPatient);

module.exports = router;
