const Appointment = require("../models/Appointment");

// ================= GET APPOINTMENTS =================
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user.userId }).sort({ date: 1 });
    res.status(200).json(appointments);
  } catch (error) {
    console.error("❌ Error fetching appointments:", error);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

// ================= CREATE APPOINTMENT =================
exports.createAppointment = async (req, res) => {
  try {
    const { doctorName, specialty, date, time } = req.body;
    
    // Validate required fields
    if (!doctorName || !specialty || !date || !time) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newAppointment = new Appointment({
      user: req.user.userId,
      doctorName,
      specialty,
      date,
      time,
      status: "upcoming"
    });

    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (error) {
    console.error("❌ Error creating appointment:", error);
    res.status(500).json({ message: "Failed to create appointment" });
  }
};

// ================= UPDATE APPOINTMENT STATUS =================
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Allowed status values
    if (!["upcoming", "completed", "cancelled"].includes(status.toLowerCase())) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const appointment = await Appointment.findOne({ _id: id, user: req.user.userId });
    
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.status = status.toLowerCase();
    await appointment.save();

    res.status(200).json(appointment);
  } catch (error) {
    console.error("❌ Error updating appointment:", error);
    res.status(500).json({ message: "Failed to update appointment" });
  }
};
