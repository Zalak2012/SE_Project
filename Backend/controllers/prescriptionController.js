const Prescription = require("../models/Prescription");

exports.createPrescription = async (req, res) => {
    try {
        const { patientId, diagnosis, medicines, notes } = req.body;
        const doctorId = req.user.userId;

        const newPrescription = new Prescription({
            patientId,
            doctorId,
            diagnosis,
            medicines,
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

exports.getDoctorPrescriptions = async (req, res) => {
    try {
        const doctorId = req.user.userId;
        const prescriptions = await Prescription.find({ doctorId })
            .populate("patientId", "name email")
            .sort({ createdAt: -1 });
        res.status(200).json(prescriptions);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch doctor prescriptions" });
    }
};

exports.updatePrescription = async (req, res) => {
    try {
        const { id } = req.params;
        const { patientId, diagnosis, medicines, notes } = req.body;
        const doctorId = req.user.userId;

        const updatedPrescription = await Prescription.findOneAndUpdate(
            { _id: id, doctorId },
            { patientId, diagnosis, medicines, notes },
            { new: true, runValidators: true }
        );

        if (!updatedPrescription) {
            return res.status(404).json({ message: "Prescription not found or unauthorized" });
        }

        res.status(200).json(updatedPrescription);
    } catch (error) {
        res.status(500).json({ message: "Failed to update prescription" });
    }
};
