const Prescription = require("../models/Prescription");

exports.createPrescription = async (req, res) => {
    try {
        const { patientId, medicineName, dosage, notes } = req.body;
        const doctorId = req.user.userId;

        const newPrescription = new Prescription({
            patientId,
            doctorId,
            medicineName,
            dosage,
            notes
        });

        await newPrescription.save();
        res.status(201).json(newPrescription);
    } catch (error) {
        res.status(500).json({ message: "Failed to create prescription" });
    }
};

exports.getPrescriptionsByPatient = async (req, res) => {
    try {
        const { patientId } = req.params;
        const query = { patientId };

        if (req.user.role === "patient" && req.user.userId !== patientId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const prescriptions = await Prescription.find(query).populate("doctorId", "name specialty").sort({ createdAt: -1 });
        res.status(200).json(prescriptions);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch prescriptions" });
    }
};
