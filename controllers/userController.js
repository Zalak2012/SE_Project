// controllers/userController.js

const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// ================= HELPER: Generate JWT =================
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET || "secret123", // fallback (not for production)
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    }
  );
};

// ================= HELPER: Validations =================
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password) => {
  // At least 8 chars, 1 uppercase, 1 number, 1 special character
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// ================= SIGNUP =================
exports.signupUser = async (req, res) => {
  console.log("➡️ API hit: /api/users/signup"); // DEBUG LOG

  try {
    const { name, email, password, role } = req.body;

    // ✅ Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        message: "Invalid email format.",
      });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters, contain 1 uppercase, 1 number, and 1 special character.",
      });
    }

    // ✅ Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // ✅ Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ Save user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'patient'
    });

    console.log("⏳ Before saving user to MongoDB..."); // DEBUG LOG
    await newUser.save();
    console.log("✅ After saving user to MongoDB successfully!", newUser._id); // DEBUG LOG

    // ✅ Generate token
    const token = generateToken(newUser);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        gender: newUser.gender,
        avatarUrl: newUser.avatarUrl
      },
    });

  } catch (error) {
    console.error("❌ Signup error:", error); // DEBUG LOG
    res.status(500).json({
      message: "Error registering user",
    });
  }
};

// ================= LOGIN =================
exports.loginUser = async (req, res) => {
  console.log("➡️ API hit: /api/users/login"); // DEBUG LOG

  try {
    const { email, password } = req.body;

    // ✅ Basic validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // ✅ Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // ✅ Generate token
    const token = generateToken(user);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        gender: user.gender,
        avatarUrl: user.avatarUrl
      },
    });

  } catch (error) {
    console.error("❌ Login error:", error); // DEBUG LOG
    res.status(500).json({
      message: "Login error",
    });
  }
};

// ================= UPDATE PROFILE =================
exports.updateUserProfile = async (req, res) => {
  console.log("PUT /api/users/profile HIT"); // DEBUG LOG

  try {
    if (req.body.email) {
      return res.status(400).json({ message: "Email cannot be changed" });
    }

    const { name, phone, gender, avatarUrl } = req.body;
    
    // Get user id from the token via authMiddleware (req.user.userId)
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
        role: updatedUser.role
      }
    });
  } catch (error) {
    console.error("❌ Update profile error:", error);
    res.status(500).json({ message: "Error updating profile" });
  }
};