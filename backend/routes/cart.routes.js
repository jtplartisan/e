const express = require("express");
const router = express.Router();

const {
  addToCart,
  removeFromCart,
  clearCart,
} = require("../controllers/cart.controller");

const authMiddleware = require("../middleware/auth.middleware");

router.post("/add", authMiddleware, addToCart);
router.post("/remove", authMiddleware, removeFromCart);
router.post("/clear", authMiddleware, clearCart);

module.exports = router;