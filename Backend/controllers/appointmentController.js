const Appointment = require("../models/Appointment");
const Schedule = require("../models/Schedule");
const Notification = require("../models/Notification");
const sendEmail = require("../utils/emailSender");
const User = require("../models/User");

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
    const { doctorId, appointmentDate, appointmentTime, paymentMethod, consultationType, notes, amount } = req.body;
    const patientId = req.user.userId;

    // 1. Validation
    if (!doctorId || !appointmentDate || !appointmentTime || !paymentMethod || !amount) {
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
      amount,
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

    // 5. Create notification for doctor
    await Notification.create({
      userId: doctorId,
      title: "New Appointment Booked",
      message: `A patient has booked an appointment for ${appointmentDate} at ${appointmentTime}.`
    });

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

    // Create notification and send email if cancelled
    if (status.toLowerCase() === "cancelled") {
        // Fetch full details for email
        const fullAppt = await Appointment.findById(id)
            .populate("patientId", "name email")
            .populate("doctorId", "name");

        await Notification.create({
            userId: appointment.patientId,
            title: "Appointment Cancelled",
            message: `Your appointment on ${appointment.appointmentDate} at ${appointment.appointmentTime} has been cancelled by the doctor.`
        });

        // ✅ Send Email Notification
        try {
            await sendEmail({
                email: fullAppt.patientId.email,
                subject: "Appointment Cancellation - CareMatePlus",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e1e1e1; border-radius: 10px; padding: 20px;">
                        <h2 style="color: #D32F2F; text-align: center;">Appointment Cancelled</h2>
                        <p>Hello <strong>${fullAppt.patientId.name}</strong>,</p>
                        <p>We regret to inform you that your appointment has been cancelled.</p>
                        <div style="background-color: #FFEBEE; border-left: 4px solid #D32F2F; padding: 15px; margin: 20px 0;">
                            <p style="margin: 0; font-weight: bold;">Details:</p>
                            <p style="margin: 5px 0 0 0;">Doctor: Dr. ${fullAppt.doctorId.name}</p>
                            <p style="margin: 2px 0 0 0;">Date: ${new Date(fullAppt.appointmentDate).toLocaleDateString()}</p>
                            <p style="margin: 2px 0 0 0;">Time: ${fullAppt.appointmentTime}</p>
                        </div>
                        <p>If you have already paid for this appointment, our team will process your refund shortly, or you can book another slot with the doctor.</p>
                        <p style="color: #777; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">This is an automated notification from CareMatePlus.</p>
                    </div>
                `
            });
            console.log("✅ Cancellation email sent to:", fullAppt.patientId.email);
        } catch (emailErr) {
            console.error("❌ Failed to send cancellation email:", emailErr.message);
        }
    }

    res.status(200).json(appointment);
  } catch (error) {
    console.error("❌ Error updating appointment:", error);
    res.status(500).json({ message: "Failed to update status" });
  }
};
