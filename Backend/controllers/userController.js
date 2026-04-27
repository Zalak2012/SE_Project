// controllers/userController.js

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const logActivity = require("../utils/logActivity");
const sendEmail = require("../utils/emailSender");
const crypto = require("crypto");

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

    // ✅ Generate Verification OTP
    const verificationOTP = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: finalRole,
      isApproved,
      status,
      verificationToken: verificationOTP,
      verificationTokenExpires: otpExpires
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

    // ✅ Send Verification Email
    try {
      await sendEmail({
        email: savedUser.email,
        subject: "Verify your CareMatePlus Account",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e1e1e1; border-radius: 10px; padding: 20px;">
            <h2 style="color: #01579B; text-align: center;">Welcome to CareMatePlus!</h2>
            <p>Hello <strong>${savedUser.name}</strong>,</p>
            <p>Thank you for joining our platform. To complete your registration, please use the verification code below:</p>
            <div style="background-color: #f0fdfc; border: 2px dashed #028090; border-radius: 8px; padding: 15px; text-align: center; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #028090;">${verificationOTP}</span>
            </div>
            <p>This code will expire in 10 minutes.</p>
            <p style="color: #777; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; pt: 10px;">If you didn't create an account, you can safely ignore this email.</p>
          </div>
        `
      });
    } catch (emailErr) {
      console.error("❌ EMAIL SEND FAILED:", emailErr.message);
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

    // ✅ Both doctor and patient go through email verification
    res.status(201).json({
      message: finalRole === "doctor"
        ? "Please verify your email. After verification, your account will await admin approval."
        : "Registration successful. Please check your email for the verification code.",
      email: savedUser.email,
      requiresVerification: true
    });

  } catch (error) {
    console.error("❌ Signup error:", error);
    res.status(500).json({
      message: "Error registering user",
    });
  }
};

// ================= VERIFY EMAIL =================
exports.verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ 
      email, 
      verificationToken: otp,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isEmailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    // Doctor flow: email verified but still needs admin approval
    if (user.role === "doctor" && !user.isApproved) {
      return res.status(200).json({
        message: "Email verified successfully! Your account is now pending admin approval. You will be notified once approved.",
        doctorPendingApproval: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          isApproved: user.isApproved
        }
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: "Email verified successfully",
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
    console.error("❌ Verification error:", error);
    res.status(500).json({ message: "Error verifying email" });
  }
};

// ================= RESEND OTP =================
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    const verificationOTP = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationToken = verificationOTP;
    user.verificationTokenExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendEmail({
      email: user.email,
      subject: "New Verification Code - CareMatePlus",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e1e1e1; border-radius: 10px; padding: 20px;">
          <h2 style="color: #01579B; text-align: center;">New Verification Code</h2>
          <p>Hello <strong>${user.name}</strong>,</p>
          <p>You requested a new verification code. Please use the code below to verify your account:</p>
          <div style="background-color: #f0fdfc; border: 2px dashed #028090; border-radius: 8px; padding: 15px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #028090;">${verificationOTP}</span>
          </div>
          <p>This code will expire in 10 minutes.</p>
        </div>
      `
    });

    res.status(200).json({ message: "Verification code resent successfully" });
  } catch (error) {
    console.error("❌ Resend OTP error:", error);
    res.status(500).json({ message: "Error resending OTP" });
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

    // ✅ Email verification check
    if (!user.isEmailVerified) {
      // Generate new OTP and send it
      const verificationOTP = Math.floor(100000 + Math.random() * 900000).toString();
      user.verificationToken = verificationOTP;
      user.verificationTokenExpires = Date.now() + 10 * 60 * 1000;
      await user.save();

      try {
        await sendEmail({
          email: user.email,
          subject: "Verify your CareMatePlus Account",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e1e1e1; border-radius: 10px; padding: 20px;">
              <h2 style="color: #01579B; text-align: center;">Email Verification Required</h2>
              <p>Hello <strong>${user.name}</strong>,</p>
              <p>Your email is not yet verified. Please use the code below to verify your account:</p>
              <div style="background-color: #f0fdfc; border: 2px dashed #028090; border-radius: 8px; padding: 15px; text-align: center; margin: 20px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #028090;">${verificationOTP}</span>
              </div>
              <p>This code will expire in 10 minutes.</p>
            </div>
          `
        });
      } catch (emailErr) {
        console.error("❌ Verification email send failed:", emailErr.message);
      }

      return res.status(403).json({
        message: "Please verify your email first. A new verification code has been sent.",
        requiresVerification: true,
        email: user.email
      });
    }

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

// ================= FORGOT PASSWORD =================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "No user found with this email" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Set reset token and expiry (1 hour)
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpires = Date.now() + 3600000;

    await user.save();

    // Create reset URL using environment variable
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    console.log("DEBUG: Generating reset link with FRONTEND_URL:", frontendUrl);
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) have requested the reset of a password. Please make a POST request to: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset Request - CareMatePlus",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e1e1e1; border-radius: 10px; padding: 20px;">
            <h2 style="color: #01579B; text-align: center;">Password Reset Request</h2>
            <p>Hello <strong>${user.name}</strong>,</p>
            <p>You requested to reset your password. Please click the button below to set a new password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #028090; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset Password</a>
            </div>
            <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
            <p>This link will expire in 1 hour.</p>
            <p style="color: #777; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">CareMatePlus Team</p>
          </div>
        `
      });

      res.status(200).json({ message: "Email sent successfully" });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      console.error("Email send error:", err);
      return res.status(500).json({ message: "Email could not be sent" });
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ================= RESET PASSWORD =================
exports.resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() }
    }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    // Set new password
    const { password } = req.body;
    if (!password || !isValidPassword(password)) {
      return res.status(400).json({ message: "Please provide a valid password (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful. You can now login." });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};