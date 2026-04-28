const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
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
  diagnosis: {
    type: String,
    required: true
  },
  medicines: [
    {
      name: { type: String, required: true },
      dosage: { type: String, required: true },
      duration: { type: String }
    }
  ],
  notes: {
    type: String,
    default: ""
  }
}, { timestamps: true });

prescriptionSchema.index({ patientId: 1 });
prescriptionSchema.index({ doctorId: 1 });

module.exports = mongoose.model("Prescription", prescriptionSchema);
