const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getSchedule, updateSlot } = require("../controllers/scheduleController");

router.get("/", protect, getSchedule);
router.put("/slot", protect, updateSlot);

module.exports = router;
