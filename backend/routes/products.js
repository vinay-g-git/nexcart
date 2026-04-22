const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/auth");
const {
  getProducts, getFeatured, getProduct,
  createProduct, updateProduct, deleteProduct
} = require("../controllers/productController");

router.get("/",          getProducts);
router.get("/featured",  getFeatured);
router.get("/:id",       getProduct);
router.post("/",         adminOnly, createProduct);
router.put("/:id",       adminOnly, updateProduct);
router.delete("/:id",   adminOnly, deleteProduct);

module.exports = router;
