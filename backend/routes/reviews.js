const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { getReviews, addReview, deleteReview } = require("../controllers/reviewController");

router.get("/:productId",  getReviews);
router.post("/",           protect, addReview);
router.delete("/:id",      protect, deleteReview);

module.exports = router;
