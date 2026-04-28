const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { createPrescription, getPrescriptionsByPatient, getDoctorPrescriptions, updatePrescription } = require("../controllers/prescriptionController");

router.post("/", protect, createPrescription);
router.get("/", protect, getDoctorPrescriptions);
router.put("/:id", protect, updatePrescription);
router.get("/patient/:patientId", protect, getPrescriptionsByPatient);

module.exports = router;
