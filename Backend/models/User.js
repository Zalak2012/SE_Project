const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  role: {
    type: String,
    enum: ['patient', 'doctor', 'admin'],
    default: 'patient'
  },
  isApproved: {
    type: Boolean,
    default: function () {
      return this.role !== "doctor"; 
    }
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: function () {
      return this.role === "doctor" ? "pending" : "approved";
    }
  },
  phone: String,
  gender: String,
  avatarUrl: String,
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  verificationTokenExpires: Date,

  // Doctor-specific fields
  specialization: { type: String, default: "General Physician" },
  experience: { type: Number, default: 5 },
  consultationFee: { type: Number, default: 500 },
  location: { type: String, default: "Sector 21, Gandhinagar, Gujarat" },
  hospital: { type: String, default: "Civil Hospital" },
  rating: { type: Number, default: 5 },
  patientsCount: { type: Number, default: 0 },
  verified: { type: Boolean, default: true },
  available: { type: Boolean, default: true },
  bio: { type: String, default: "Experienced healthcare professional dedicated to patient care and preventive treatment." },
  education: { type: String, default: "MBBS - B.J. Medical College, Ahmedabad" },
  availability: { type: String, default: "Mon-Fri, 9 AM – 5 PM" },
  city: { type: String, default: "Ahmedabad" },
  state: { type: String, default: "Gujarat" },
  image: { type: String, default: "" }
}, { timestamps: true });


module.exports = mongoose.model("User", userSchema);