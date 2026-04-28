const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/auth");
const { placeOrder, getMyOrders, getAllOrders, updateStatus } = require("../controllers/orderController");

router.post("/",             protect,   placeOrder);
router.get("/all",           adminOnly, getAllOrders);
router.get("/",              protect,   getMyOrders);
router.put("/:id/status",   adminOnly, updateStatus);

module.exports = router;
