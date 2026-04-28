const Appointment = require("../models/Appointment");
const Schedule = require("../models/Schedule");

// ================= GET APPOINTMENTS =================
exports.getAppointments = async (req, res) => {
  try {
    let query = {};
    
    // Role-based filtering
    if (req.user.role === "patient") {
      query = { patientId: req.user.userId };
    } else if (req.user.role === "doctor") {
      query = { doctorId: req.user.userId };
    }
    // Admin sees all (query empty)

    const appointments = await Appointment.find(query)
      .populate("patientId", "name email")
      .populate("doctorId", "name email specialization")
      .sort({ appointmentDate: 1, appointmentTime: 1 });

      
    res.status(200).json(appointments);
  } catch (error) {
    console.error("❌ Error fetching appointments:", error);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

// ================= CREATE APPOINTMENT =================
exports.createAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate, appointmentTime, paymentMethod, consultationType, notes } = req.body;
    const patientId = req.user.userId;

    // 1. Validation
    if (!doctorId || !appointmentDate || !appointmentTime || !paymentMethod) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 2. Prevent Duplicate/Double Booking
    const existing = await Appointment.findOne({
      doctorId,
      appointmentDate,
      appointmentTime,
      status: { $ne: "cancelled" }
    });

    if (existing) {
      return res.status(400).json({ message: "This slot is already booked" });
    }

    // 3. Prepare Payment Status
    const paymentStatus = paymentMethod === "cash" ? "pending_cash" : "paid";

    const newAppointment = new Appointment({
      patientId,
      doctorId,
      appointmentDate,
      appointmentTime,
      paymentMethod,
      paymentStatus,
      consultationType: consultationType || "General Consultation",
      notes: notes || "",
      status: "upcoming"
    });

    await newAppointment.save();

    // 4. Update Schedule automatically
    await Schedule.findOneAndUpdate(
      { doctorId, date: new Date(appointmentDate).setHours(0,0,0,0) },
      { $set: { "slots.$[elem].status": "booked" } },
      { arrayFilters: [{ "elem.time": appointmentTime }] }
    );

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

    if (!["upcoming", "completed", "cancelled"].includes(status.toLowerCase())) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const appointment = await Appointment.findById(id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    // Validation permissions
    if (req.user.role === "doctor" && appointment.doctorId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    appointment.status = status.toLowerCase();
    await appointment.save();

    res.status(200).json(appointment);
  } catch (error) {
    console.error("❌ Error updating appointment:", error);
    res.status(500).json({ message: "Failed to update status" });
  }
};
