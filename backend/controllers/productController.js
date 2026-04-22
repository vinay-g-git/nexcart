const Product = require("../models/Product");

// @desc  Get all products (with filter, search, sort, pagination)
// @route GET /api/products
exports.getProducts = async (req, res) => {
  const { category, search, sort, page = 1, limit = 12, featured } = req.query;
  const filter = {};

  if (category && category !== "all") filter.category = category;
  if (featured === "true") filter.featured = true;
  if (search) filter.$text = { $search: search };

  let sortObj = {};
  if (sort === "price-asc")  sortObj = { price: 1 };
  else if (sort === "price-desc") sortObj = { price: -1 };
  else if (sort === "rating")     sortObj = { rating: -1 };
  else if (sort === "popular")    sortObj = { sold: -1 };
  else sortObj = { createdAt: -1 };

  const skip = (Number(page) - 1) * Number(limit);
  const [products, total] = await Promise.all([
    Product.find(filter).sort(sortObj).skip(skip).limit(Number(limit)),
    Product.countDocuments(filter),
  ]);

  res.json({ products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
};

// @desc  Get featured products
// @route GET /api/products/featured
exports.getFeatured = async (req, res) => {
  const products = await Product.find({ featured: true }).limit(6);
  res.json(products);
};

// @desc  Get single product
// @route GET /api/products/:id
exports.getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
};

// @desc  Create product (admin)
// @route POST /api/products
exports.createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
};

// @desc  Update product (admin)
// @route PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
};

// @desc  Delete product (admin)
// @route DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json({ message: "Product removed" });
};
