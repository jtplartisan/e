const express = require("express");
const router = express.Router();

const {
  addToWishlist,
  getWishlist,
  removeFromWishlist
} = require("../controllers/wishList");

const authMiddleware = require("../middleware/auth.middleware");



router.post(
  "/add",
  authMiddleware,
  addToWishlist
);



router.get(
  "/",
  authMiddleware,
  getWishlist
);



router.delete(
  "/remove/:productId",
  authMiddleware,
  removeFromWishlist
);


module.exports = router;