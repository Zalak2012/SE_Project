const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();

const { signupUser, loginUser } = require("../controllers/userController");

router.get("/test", (req, res) => {
  res.json({ message: "User route working" });
});

router.post("/signup", signupUser);
router.post("/login", loginUser);

module.exports = router;