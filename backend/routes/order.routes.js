const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getOrderById,
  payOrder,
  getAllOrders,
  deliverOrder ,
  cancelOrder,
  rejectOrder,
  returnOrder,
  acceptReturn,
  rejectReturn,
  
} = require("../controllers/order.controller");

const authMiddleware = require("../middleware/auth.middleware");

// Create Order
router.post("/", authMiddleware, createOrder);

// Customer Orders
router.get("/my-orders", authMiddleware, getMyOrders);

// Admin All Orders
router.get("/all", authMiddleware, getAllOrders);

// Single Order
router.get("/:id", authMiddleware, getOrderById);

// Payment
router.put("/:id/pay", authMiddleware, payOrder);

router.put("/:id/deliver", authMiddleware, deliverOrder);

router.put("/:id/cancel", authMiddleware, cancelOrder);

router.put("/:id/reject", authMiddleware, rejectOrder);

router.put("/:id/return", authMiddleware, returnOrder);

router.put("/:id/return/accept", authMiddleware, acceptReturn);

// Reject return (Seller)
router.put("/:id/return/reject", authMiddleware, rejectReturn);



module.exports = router;  