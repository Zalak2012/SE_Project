const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  appointmentTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["upcoming", "completed", "cancelled"],
    default: "upcoming"
  },
  paymentMethod: {
    type: String,
    enum: ["cash", "online"],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ["paid", "pending_cash"],
    default: "pending_cash"
  },
  consultationType: {
    type: String,
    default: "General Consultation"
  },
  notes: {
    type: String,
    default: ""
  }
}, { timestamps: true });

// Performance Indexes
appointmentSchema.index({ doctorId: 1 });
appointmentSchema.index({ patientId: 1 });
appointmentSchema.index({ appointmentDate: 1 });

module.exports = mongoose.model("Appointment", appointmentSchema);
