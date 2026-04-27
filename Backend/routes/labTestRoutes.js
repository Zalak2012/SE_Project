const express = require("express");
const router = express.Router();
const labTestController = require("../controllers/labTestController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", labTestController.getLabTests);
router.post("/", protect, labTestController.addLabTest);
router.put("/:id", protect, labTestController.updateLabTest);
router.delete("/:id", protect, labTestController.deleteLabTest);

module.exports = router;
