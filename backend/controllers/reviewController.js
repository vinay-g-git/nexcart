const Review = require("../models/Review");
const Product = require("../models/Product");

// @desc  Get reviews for a product
// @route GET /api/reviews/:productId
exports.getReviews = async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId })
    .populate("user", "name avatar")
    .sort({ createdAt: -1 });
  res.json(reviews);
};

// @desc  Add a review
// @route POST /api/reviews
exports.addReview = async (req, res) => {
  const { productId, rating, comment } = req.body;

  const alreadyReviewed = await Review.findOne({ product: productId, user: req.userId });
  if (alreadyReviewed) return res.status(400).json({ error: "You have already reviewed this product" });

  const review = await Review.create({ product: productId, user: req.userId, rating, comment });
  await review.populate("user", "name avatar");

  // Recalculate rating
  const allReviews = await Review.find({ product: productId });
  const avgRating = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
  await Product.findByIdAndUpdate(productId, { rating: avgRating.toFixed(1), reviewCount: allReviews.length });

  res.status(201).json(review);
};

// @desc  Delete a review (admin or owner)
// @route DELETE /api/reviews/:id
exports.deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ error: "Review not found" });
  if (review.user.toString() !== req.userId && req.session.role !== "admin") {
    return res.status(403).json({ error: "Not authorized" });
  }
  await review.deleteOne();
  res.json({ message: "Review removed" });
};
