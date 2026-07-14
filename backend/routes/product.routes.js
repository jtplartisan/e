const express = require("express");
const router = express.Router();

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts ,
  bulkCreateProducts
} = require("../controllers/product.controller");

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const upload = require("../middleware/upload.middleware");
const uploadExcel = require("../middleware/uploadExcel");

router.get("/", getProducts);


router.get("/my-products", authMiddleware, getMyProducts);

router.get("/:id", getProduct);

router.get("/", getProducts);


router.post(
  "/",
  authMiddleware,
  roleMiddleware("seller"),
  upload.single("image"),
  createProduct
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("seller"),
  upload.single("image"),   
  updateProduct
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("seller"),
  deleteProduct
);


router.post(
  "/bulk-create",
  authMiddleware,
  uploadExcel.single("file"), bulkCreateProducts
  
);

module.exports = router;