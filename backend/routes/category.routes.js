const express = require("express");
const router = express.Router();

const {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  categoryFilter
} = require("../controllers/category.controller");

const authMiddleware = require("../middleware/auth.middleware");

// Add Category
router.post("/add", authMiddleware, addCategory);

// Get All Categories
router.get("/", getCategories);

// Update Category
router.put("/:id", authMiddleware, updateCategory);

// Delete Category
router.delete("/:id", authMiddleware, deleteCategory);

router.get("/filter",categoryFilter)

module.exports = router;   