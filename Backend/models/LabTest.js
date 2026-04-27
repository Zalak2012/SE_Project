const mongoose = require("mongoose");

const labTestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  responseTime: { type: String, default: "24 hours" },
  icon: { type: String, default: "🧪" }
}, { timestamps: true });

module.exports = mongoose.model("LabTest", labTestSchema);
