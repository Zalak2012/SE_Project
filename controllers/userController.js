const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= SIGNUP =================
exports.signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ✅ Proper email format validation
    const allowedEmail = /^[^\s@]+@[^\s@]+\.(com|org|net|io|edu|ac\.in|co\.in|gov\.in)$/;
    if (!allowedEmail.test(email)) {
      return res.status(400).json({
        message: "Only valid email domains allowed"
      });
    }

    // ✅ Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create user
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully ✅"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error registering user"
    });
  }
};


// ================= LOGIN =================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Validate email format (domain restriction)
    const allowedEmail = /^[^\s@]+@[^\s@]+\.(com|org|net|io|edu|ac\.in|co\.in|gov\.in)$/;
    if (!allowedEmail.test(email)) {
      return res.status(400).json({
        message: "Invalid email domain"
      });
    }

    // ✅ Check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password"
      });
    }

    // ✅ Create JWT
    const token = jwt.sign(
      {
        userId: user._id,
        name: user.name,
        email: user.email
      },
      "secretkey123",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful ✅",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Login error"
    });
  }
};