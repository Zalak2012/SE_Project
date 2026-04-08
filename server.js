require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const protect = require("./middleware/authMiddleware");
const userRoutes = require("./routes/userRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const User = require("./models/User");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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
        userId: user._id
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/appointments", appointmentRoutes);

// 🔥 CONNECT TO MONGODB ATLAS
mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000 // Add a timeout so it doesn't hang forever
})
  .then(() => {
    console.log("MongoDB Atlas connected ✅");
  })
  .catch(err => {
    console.error("❌ Mongo Connection Error: Ensure your IP is whitelisted in MongoDB Atlas and credentials are correct!");
    console.error(err);
  });

// Start server independently of DB connection
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server is now running and accepting API requests on http://127.0.0.1:${PORT}`);
});