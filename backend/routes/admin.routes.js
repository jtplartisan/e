const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  blockUser,
  unblockUser,
  getDashboardStats,
} = require("../controllers/admin.controller");

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

router.use(authMiddleware);
router.use(roleMiddleware("admin"));

router.get("/users", getAllUsers);

router.put("/block/:id", blockUser);

router.put("/unblock/:id", unblockUser);

router.get("/dashboard", getDashboardStats);

module.exports = router;