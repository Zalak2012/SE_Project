const express = require("express");
const router = express.Router();

const { signupUser, loginUser, updateUserProfile } = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.put("/profile", protect, updateUserProfile);

module.exports = router;