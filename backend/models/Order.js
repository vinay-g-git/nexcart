const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name:     String,
  emoji:    String,
  price:    { type: Number, required: true },
  qty:      { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items:    [orderItemSchema],
  address:  { street: String, city: String, zip: String, country: String },
  paymentMethod: { type: String, enum: ["card", "paypal", "cod"], default: "card" },
  subtotal: { type: Number, required: true },
  shipping: { type: Number, default: 0 },
  total:    { type: Number, required: true },
  status:   { type: String, enum: ["Processing","Shipped","Delivered","Cancelled"], default: "Processing" },
  estimatedDelivery: Date,
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
