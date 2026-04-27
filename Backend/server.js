require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path"); // ✅ Added missing import

const { protect } = require("./middleware/authMiddleware");
const userRoutes = require("./routes/userRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const activityRoutes = require("./routes/activityRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const medicalRecordRoutes = require("./routes/medicalRecordRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const labTestRoutes = require("./routes/labTestRoutes");
const User = require("./models/User");
const seedAdmin = require("./utils/seedAdmin");
const seedLabTests = require("./utils/seedLabTests");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Test route
app.get("/", (req, res) => {
  res.send("Backend running");
});

// Protected route
app.get("/api/protected", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    res.json({
      message: "Protected route accessed ✅",
      user: {
        name: user.name,
        email: user.email,
        userId: user._id,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
});

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/users", userRoutes);
app.use("/api/doctors", userRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", activityRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/medical-records", medicalRecordRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/labtests", labTestRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI);

mongoose.connection.once("open", () => {
  console.log("✅ Connected DB:", mongoose.connection.name);
});

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected ✅");

  seedAdmin();
  seedLabTests();

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Server running on http://127.0.0.1:${PORT}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error ❌", err);
  process.exit(1);
});