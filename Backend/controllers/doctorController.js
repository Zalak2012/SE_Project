const Appointment = require("../models/Appointment");
const User = require("../models/User");
const mongoose = require("mongoose");

// ================= FETCH DASHBOARD STATS =================
exports.fetchDashboardStats = async (req, res) => {
    try {
        const doctorId = new mongoose.Types.ObjectId(req.user.userId);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const stats = await Appointment.aggregate([
            { $match: { doctorId: doctorId } },
            {
                $group: {
                    _id: null,
                    totalAppointments: { $sum: 1 },
                    pendingAppointments: { $sum: { $cond: [{ $eq: ["$status", "upcoming"] }, 1, 0] } },
                    completedAppointments: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
                    todayAppointments: {
                        $sum: {
                            $cond: [
                                { $and: [{ $eq: ["$appointmentDate", today] }, { $eq: ["$status", "upcoming"] }] },
                                1, 0
                            ]
                        }
                    },
                    totalPatientsSet: { $addToSet: "$patientId" }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalAppointments: 1,
                    pendingAppointments: 1,
                    completedAppointments: 1,
                    todayAppointments: 1,
                    totalPatients: { $size: "$totalPatientsSet" }
                }
            }
        ]);

        const defaultStats = {
            totalAppointments: 0,
            pendingAppointments: 0,
            completedAppointments: 0,
            todayAppointments: 0,
            totalPatients: 0
        };

        res.status(200).json(stats[0] || defaultStats);
    } catch (error) {
        console.error("❌ Stats error:", error);
        res.status(500).json({ message: "Failed to fetch stats" });
    }
};

// ================= FETCH DOCTOR PATIENTS =================
exports.fetchDoctorPatients = async (req, res) => {
    try {
        const doctorId = new mongoose.Types.ObjectId(req.user.userId);

        // Find unique patientIds from appointments with this doctor
        const patientIds = await Appointment.distinct("patientId", { doctorId });
        
        const patients = await User.find({ _id: { $in: patientIds } })
            .select("name email phone gender age location");

        res.status(200).json(patients);
    } catch (error) {
        console.error("❌ Patients fetch error:", error);
        res.status(500).json({ message: "Failed to fetch patients" });
    }
};

// ================= FETCH LOGGED-IN DOCTOR PROFILE =================
exports.getDoctorProfile = async (req, res) => {
    try {
        const doctor = await User.findById(req.user.userId).select("-password");

        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        res.status(200).json(doctor);
    } catch (error) {
        console.error("❌ Profile fetch error:", error);
        res.status(500).json({ message: "Failed to fetch doctor profile" });
    }
};

// ================= UPDATE LOGGED-IN DOCTOR PROFILE =================
exports.updateDoctorProfile = async (req, res) => {
    try {
        const doctorId = req.user.userId;

        // Fields allowed to be updated
        const {
            name,
            specialization,
            bio,
            education,
            experience,
            consultationFee,
            availability,
            location,
            image
        } = req.body;

        const updatedDoctor = await User.findByIdAndUpdate(
            doctorId,
            {
                ...req.body,
                ...(req.file ? { image: `/uploads/doctors/${req.file.filename}` } : {})
            },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedDoctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        res.status(200).json(updatedDoctor);
    } catch (error) {
        console.error("❌ Profile update error:", error);
        res.status(500).json({ message: "Failed to update profile" });
    }
};
