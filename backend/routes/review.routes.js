const express = require("express");
const router = express.Router();

const {
  addReview,
  getProductReviews,
  updateReview,
  
} = require("../controllers/review.controller");

const authMiddleware = require("../middleware/auth.middleware");
// Add Review
router.post("/", authMiddleware, addReview);

// Get Reviews by Product
router.get("/:productId", getProductReviews);

// Update Review
router.put("/:id", authMiddleware, updateReview);


module.exports = router;