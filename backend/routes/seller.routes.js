const express = require("express");
const router = express.Router();

const {
  getSellerProducts,
  getSellerOrders,
  shipOrder
  
} = require("../controllers/seller.controller");

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

router.use(authMiddleware);
router.use(roleMiddleware("seller"));

router.get("/products", getSellerProducts);

router.get("/orders", getSellerOrders);

router.put("/orders/:id/ship", shipOrder);



module.exports = router;