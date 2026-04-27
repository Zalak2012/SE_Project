const express = require("express");
const router = express.Router();

const { protect, isAdmin } = require("../middleware/authMiddleware");
const { getActivities } = require("../controllers/activityController");

router.get("/activities", protect, isAdmin, getActivities);

module.exports = router;
