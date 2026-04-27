const MedicalRecord = require("../models/MedicalRecord");

exports.createRecord = async (req, res) => {
    try {
        const { patientId, title, condition, description, status } = req.body;
        const doctorId = req.user.userId;

        const newRecord = new MedicalRecord({
            patientId,
            doctorId,
            title,
            condition,
            description,
            status
        });

        await newRecord.save();
        res.status(201).json(newRecord);
    } catch (error) {
        res.status(500).json({ message: "Failed to create record" });
    }
};

exports.getRecordsByPatient = async (req, res) => {
    try {
        const { patientId } = req.params;
        const query = { patientId };
        
        // Security check
        if (req.user.role === "patient" && req.user.userId !== patientId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const records = await MedicalRecord.find(query).populate("doctorId", "name specialty").sort({ createdAt: -1 });
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch records" });
    }
};

exports.getRecords = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === "doctor") {
            query.doctorId = req.user.userId;
        } else if (req.user.role === "patient") {
            query.patientId = req.user.userId;
        }

        const records = await MedicalRecord.find(query)
            .populate("patientId", "name email")
            .populate("doctorId", "name specialty")
            .sort({ createdAt: -1 });
            
        res.status(200).json(records);
    } catch (error) {
        console.error("Fetch records error:", error);
        res.status(500).json({ message: "Failed to fetch records" });
    }
};
