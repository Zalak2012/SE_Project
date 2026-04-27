const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  slots: [{
    time: String,
    status: {
      type: String,
      enum: ["available", "booked", "active", "break"],
      default: "available"
    }
  }]
}, { timestamps: true });

scheduleSchema.index({ doctorId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Schedule", scheduleSchema);
