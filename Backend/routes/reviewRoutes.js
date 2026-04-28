const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", reviewController.getReviews);
router.post("/", protect, reviewController.addReview);
router.put("/:id", protect, reviewController.updateReviewStatus);
router.delete("/:id", protect, reviewController.deleteReview);

module.exports = router;
