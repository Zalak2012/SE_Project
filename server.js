require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const protect = require("./middleware/authMiddleware");
const userRoutes = require("./routes/userRoutes");
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

// 🔥 CONNECT TO MONGODB ATLAS (ONLY THIS ONE)
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Atlas connected ✅");

    // Start server ONLY after DB connects
    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch(err => console.log("Mongo Error:", err));