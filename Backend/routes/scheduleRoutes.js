const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getSchedule, updateSlot, addSlot } = require("../controllers/scheduleController");

router.get("/", protect, getSchedule);
router.put("/slot", protect, updateSlot);
router.post("/slot/add", protect, addSlot);

module.exports = router;
