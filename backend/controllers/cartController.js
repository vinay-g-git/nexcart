const Cart = require("../models/Cart");
const Product = require("../models/Product");

// @desc  Get user cart
// @route GET /api/cart
exports.getCart = async (req, res) => {
  let cart = await Cart.findOne({ user: req.userId });
  if (!cart) cart = { items: [], total: 0 };
  const total = (cart.items || []).reduce((s, i) => s + i.price * i.qty, 0);
  res.json({ items: cart.items || [], total });
};

// @desc  Add item to cart
// @route POST /api/cart
exports.addItem = async (req, res) => {
  const { productId, qty = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ error: "Product not found" });
  if (product.stock < 1) return res.status(400).json({ error: "Out of stock" });

  let cart = await Cart.findOne({ user: req.userId });
  if (!cart) cart = new Cart({ user: req.userId, items: [] });

  const existing = cart.items.find(i => i.product.toString() === productId);
  if (existing) {
    existing.qty = Math.min(existing.qty + qty, product.stock);
  } else {
    cart.items.push({ product: productId, name: product.name, emoji: product.emoji, price: product.price, qty, stock: product.stock });
  }

  await cart.save();
  const total = cart.items.reduce((s, i) => s + i.price * i.qty, 0);
  res.json({ items: cart.items, total });
};

// @desc  Update cart item qty
// @route PUT /api/cart/:productId
exports.updateItem = async (req, res) => {
  const { qty } = req.body;
  const cart = await Cart.findOne({ user: req.userId });
  if (!cart) return res.status(404).json({ error: "Cart not found" });

  if (qty <= 0) {
    cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId);
  } else {
    const item = cart.items.find(i => i.product.toString() === req.params.productId);
    if (item) item.qty = qty;
  }

  await cart.save();
  const total = cart.items.reduce((s, i) => s + i.price * i.qty, 0);
  res.json({ items: cart.items, total });
};

// @desc  Clear cart
// @route DELETE /api/cart
exports.clearCart = async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.userId }, { items: [] });
  res.json({ items: [], total: 0 });
};
