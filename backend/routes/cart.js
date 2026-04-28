const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { getCart, addItem, updateItem, clearCart } = require("../controllers/cartController");

router.get("/",              protect, getCart);
router.post("/",             protect, addItem);
router.put("/:productId",   protect, updateItem);
router.delete("/:productId", protect, updateItem);
router.delete("/",           protect, clearCart);

module.exports = router;
