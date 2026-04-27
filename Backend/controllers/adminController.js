const User = require("../models/User");
const Appointment = require("../models/Appointment");
const logActivity = require("../utils/logActivity");

// Fetch all doctors (Pending, Approved, Rejected)
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).sort({ createdAt: -1 });
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch all doctors" });
  }
};

// Fetch doctors with pending status
exports.getPendingDoctors = async (req, res) => {
  try {
    const doctors = await User.find({
      role: "doctor",
      status: "pending"
    }).sort({ createdAt: -1 });

    console.log("Pending Doctors:", doctors);

    res.status(200).json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch pending doctors"
    });
  }
};


// Fetch already approved doctors
exports.getApprovedDoctors = async (req, res) => {
  try {
    const doctors = await User.find({
      role: "doctor",
      status: "approved",
    }).sort({ updatedAt: -1 });

    console.log("Approved Doctors fetched:", doctors.length);

    res.json(doctors);
  } catch (err) {
    console.error("Error fetching approved doctors:", err);
    res.status(500).json({
      message: "Error fetching approved doctors",
    });
  }
};

// Approve a doctor
exports.approveDoctor = async (req, res) => {
  try {
    const doctor = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: true, status: "approved" },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    console.log("Doctor approved:", doctor.name);

    await logActivity(
      "doctor_approved",
      "Dr. " + doctor.name + " approved by admin"
    );

    res.json({ message: "Doctor approved successfully", doctor });
  } catch (err) {
    console.error("Approval error:", err);
    res.status(500).json({ message: "Error approving doctor" });
  }
};

// Reject a doctor (Update status, do not delete)
exports.rejectDoctor = async (req, res) => {
  try {
    const doctor = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: false, status: "rejected" },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    console.log("Doctor rejected:", doctor.name);

    await logActivity(
      "doctor_rejected",
      "Dr. " + doctor.name + " rejected by admin"
    );

    res.json({ message: "Doctor rejected successfully", doctor });
  } catch (err) {
    console.error("Rejection error:", err);
    res.status(500).json({ message: "Error rejecting doctor" });
  }
};

// Fetch platform statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments(); 
    const activeDoctors = await User.countDocuments({ role: "doctor", isApproved: true });
    const appointments = await Appointment.countDocuments();
    const pendingDoctors = await User.countDocuments({ role: "doctor", status: "pending" });

    console.log("Dashboard stats fetched:", { totalUsers, activeDoctors, appointments, pendingDoctors });

    res.json({
      totalUsers,
      activeDoctors,
      appointments,
      pendingDoctors
    });
  } catch (err) {
    console.error("Stats fetch error:", err);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};


// Fetch analytics data (Monthly user growth)
exports.getAnalytics = async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Fill in 0s for missing months or just return what's available
    const months = stats.map(item => monthNames[item._id - 1]);
    const monthlyUsers = stats.map(item => item.count);

    res.json({ months, monthlyUsers });
  } catch (err) {
    res.status(500).json({ message: "Error fetching analytics" });
  }
};

// Fetch all users (excluding admins potentially, but usually admin wants to see everyone)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } }).sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Error fetching users" });
  }
};

// Temporary DEBUG route to see all users in DB
exports.debugUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching debug users" });
  }
};

// Fetch all appointments for the whole system
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patientId", "name email")
      .populate("doctorId", "name email specialization consultationFee")
      .sort({ appointmentDate: -1, appointmentTime: -1 });

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Fetch all appointments error:", error);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    console.log("User deleted:", user.name);
    await logActivity("user_deleted", `User ${user.name} (${user.role}) removed by admin`);
    
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

// End of file
