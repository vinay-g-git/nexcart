const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name:          { type: String, required: true, trim: true },
  description:   { type: String, required: true },
  price:         { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, required: true },
  category:      { type: String, required: true, enum: ["electronics", "fashion", "home"] },
  stock:         { type: Number, required: true, default: 0, min: 0 },
  emoji:         { type: String, default: "📦" },
  badge:         { type: String, enum: ["HOT", "LIMITED", "SALE", "NEW", "BESTSELLER", null], default: null },
  featured:      { type: Boolean, default: false },
  rating:        { type: Number, default: 0, min: 0, max: 5 },
  reviewCount:   { type: Number, default: 0 },
  sold:          { type: Number, default: 0 },
}, { timestamps: true });

productSchema.index({ name: "text", description: "text" });
productSchema.index({ category: 1, price: 1 });

module.exports = mongoose.model("Product", productSchema);
