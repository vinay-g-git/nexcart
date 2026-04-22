const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// @desc  Place order
// @route POST /api/orders
exports.placeOrder = async (req, res) => {
  const { address, paymentMethod } = req.body;
  const cart = await Cart.findOne({ user: req.userId });
  if (!cart || cart.items.length === 0) return res.status(400).json({ error: "Cart is empty" });

  const subtotal = cart.items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal > 300 ? 0 : 12;
  const total = subtotal + shipping;
  const estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);

  const order = await Order.create({
    user: req.userId,
    items: cart.items.map(i => ({ product: i.product, name: i.name, emoji: i.emoji, price: i.price, qty: i.qty })),
    address,
    paymentMethod,
    subtotal,
    shipping,
    total,
    estimatedDelivery,
  });

  // Decrement stock, increment sold
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.qty, sold: item.qty },
    });
  }

  // Clear cart
  cart.items = [];
  await cart.save();

  res.status(201).json(order);
};

// @desc  Get logged-in user's orders
// @route GET /api/orders
exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 });
  res.json(orders);
};

// @desc  Get all orders (admin)
// @route GET /api/orders/all
exports.getAllOrders = async (req, res) => {
  const orders = await Order.find({}).populate("user", "name email").sort({ createdAt: -1 });
  res.json(orders);
};

// @desc  Update order status (admin)
// @route PUT /api/orders/:id/status
exports.updateStatus = async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
};
