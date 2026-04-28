// controllers/userController.js

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const logActivity = require("../utils/logActivity");

// ================= HELPER: Generate JWT =================
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET || "secret123",
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
};


// ================= HELPER: Validations =================
const isValidEmail = (email) => {
  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|[a-zA-Z0-9.-]+\.(ac\.in|edu|gov\.in|co\.in))$/;
  return emailRegex.test(email);
};

const isValidPassword = (password) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// ================= SIGNUP =================
exports.signupUser = async (req, res) => {
  console.log("➡️ API hit: /api/users/signup");

  try {
    const { name, email, password, role } = req.body;

    console.log("Signup request:", { name, email, role });

    let finalRole = role || "patient";

    if (finalRole === "admin") {
      return res.status(403).json({ message: "Admin account cannot be created" });
    }

    // ✅ Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (!isValidEmail(email) || !isValidPassword(password)) {
      return res.status(400).json({
        message: "Invalid email or password format",
      });
    }

    // ✅ Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Backend-controlled approval logic
    let isApproved = finalRole === "doctor" ? false : true;
    let status = finalRole === "doctor" ? "pending" : "approved";

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: finalRole,
      isApproved,
      status,
    });

    console.log("⏳ Saving user to MongoDB...");

    let savedUser;

    try {
      savedUser = await newUser.save();

      console.log("✅ User SAVED in DB:", {
        id: savedUser._id,
        email: savedUser.email,
        role: savedUser.role
      });
    } catch (err) {
      console.error("❌ USER SAVE FAILED:", err.message);
      return res.status(500).json({ message: "User not saved" });
    }

    // ✅ Log activity
    if (finalRole === "doctor") {
      await logActivity(
        "doctor_registered",
        "Dr. " + savedUser.name + " submitted registration"
      );
    } else {
      await logActivity(
        "patient_registered",
        "New patient registered: " + savedUser.name
      );
    }

    // ✅ Doctor flow (no login yet)
    if (finalRole === "doctor") {
      return res.status(201).json({
        message: "Doctor registration submitted. Waiting for admin approval.",
      });
    }

    // ✅ Generate token
    const token = generateToken(savedUser);

    res.status(201).json({
      token,
      user: {
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        status: savedUser.status,
        isApproved: savedUser.isApproved
      }
    });

  } catch (error) {
    console.error("❌ Signup error:", error);
    res.status(500).json({
      message: "Error registering user",
    });
  }
};

// ================= LOGIN =================
exports.loginUser = async (req, res) => {
  console.log("➡️ API hit: /api/users/login");

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    console.log("LOGIN USER:", user);

    // ✅ Doctor approval check

    if (user.role === "doctor" && !user.isApproved) {
      if (user.status === "rejected") {
        return res
          .status(403)
          .json({ message: "Your registration was rejected by the admin" });
      }
      return res
        .status(403)
        .json({ message: "Your account is pending admin approval" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        isApproved: user.isApproved
      }
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({
      message: "Login error",
    });
  }
};

// ================= UPDATE PROFILE =================
exports.updateUserProfile = async (req, res) => {
  console.log("PUT /api/users/profile HIT");

  try {
    if (req.body.email) {
      return res.status(400).json({ message: "Email cannot be changed" });
    }

    const { name, phone, gender, avatarUrl } = req.body;
    const userId = req.user.userId;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, phone, gender, avatarUrl },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        gender: updatedUser.gender,
        avatarUrl: updatedUser.avatarUrl,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error("❌ Update profile error:", error);
    res.status(500).json({ message: "Error updating profile" });
  }
};

// ================= GET USER BY ID =================
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password -__v");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Get user error:", error);
    res.status(500).json({ message: "Error fetching user" });
  }
};

// ================= GET ALL DOCTORS (PUBLIC LISTING) =================
exports.getApprovedDoctors = async (req, res) => {
  try {
    const doctors = await User.find({
      role: "doctor",
    }).select("-password -__v").sort({ name: 1 });
    
    res.status(200).json(doctors);
  } catch (error) {
    console.error("❌ Get doctors error:", error);
    res.status(500).json({ message: "Error fetching doctors" });
  }
};