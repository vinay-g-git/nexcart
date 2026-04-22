require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Product = require("../models/Product");

const users = [
  { name: "Admin User", email: "admin@nexcart.io", password: "admin123", role: "admin" },
  { name: "Jane Smith",  email: "jane@example.com",  password: "demo123",  role: "user"  },
];

const products = [
  { name:"Quantum Headphones",   price:349, originalPrice:499, category:"electronics", stock:12, badge:"HOT",        emoji:"🎧", description:"Spatial audio with 40-hour battery. Active noise cancellation.", featured:true,  rating:4.8, reviewCount:2341 },
  { name:"Obsidian Smart Watch", price:899, originalPrice:1199,category:"electronics", stock:4,  badge:"LIMITED",    emoji:"⌚", description:"AMOLED display, heart-rate monitoring, 7-day battery, IP68.",   featured:true,  rating:4.9, reviewCount:876  },
  { name:"Nomad Backpack",       price:189, originalPrice:249, category:"fashion",     stock:28, badge:"SALE",       emoji:"🎒", description:"Weatherproof 32L. Hidden laptop sleeve. Lifetime warranty.",   featured:false, rating:4.7, reviewCount:1203 },
  { name:"4K Thermal Drone",     price:1249,originalPrice:1599,category:"electronics", stock:6,  badge:"NEW",        emoji:"🚁", description:"4K stabilized gimbal. 35-min flight. Obstacle avoidance.",     featured:true,  rating:4.6, reviewCount:456  },
  { name:"Ceramic Cookware Set", price:279, originalPrice:399, category:"home",        stock:15, badge:null,         emoji:"🍳", description:"5-piece PFOA-free ceramic. Oven-safe 500°F. Induction.",        featured:false, rating:4.8, reviewCount:3201 },
  { name:"Smart Plant Pod",      price:129, originalPrice:169, category:"home",        stock:42, badge:"NEW",        emoji:"🌱", description:"Self-watering. UV grow light. App-connected monitoring.",        featured:false, rating:4.5, reviewCount:789  },
  { name:"Carbon Fiber Wallet",  price:89,  originalPrice:119, category:"fashion",     stock:67, badge:null,         emoji:"💳", description:"RFID-blocking carbon fiber. 8 cards. 0.4mm thin.",               featured:false, rating:4.7, reviewCount:2109 },
  { name:"Portable Espresso",    price:159, originalPrice:219, category:"home",        stock:23, badge:"BESTSELLER", emoji:"☕", description:"18-bar pressure. No electricity needed. 60ml per shot.",         featured:true,  rating:4.9, reviewCount:4512 },
  { name:"Merino Base Layer",    price:119, originalPrice:159, category:"fashion",     stock:34, badge:"SALE",       emoji:"👕", description:"100% Merino wool. Temperature regulating -20C to +20C.",         featured:false, rating:4.8, reviewCount:1876 },
  { name:"Weighted Blanket",     price:149, originalPrice:199, category:"home",        stock:51, badge:"BESTSELLER", emoji:"🛏️", description:"15lb glass beads. Dual-sided. Machine washable.",                featured:true,  rating:4.9, reviewCount:5632 },
  { name:"Mesh Router System",   price:329, originalPrice:429, category:"electronics", stock:19, badge:null,         emoji:"📡", description:"Wi-Fi 6E. 6000 sq ft coverage. Self-healing mesh.",               featured:false, rating:4.7, reviewCount:987  },
  { name:"Night Vision Monocular",price:449,originalPrice:599, category:"electronics", stock:8,  badge:null,         emoji:"🔭", description:"1080p sensor. 400m range. Built-in IR illuminator.",               featured:false, rating:4.6, reviewCount:321  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/nexcart");
  await User.deleteMany({});
  await Product.deleteMany({});
  for (const u of users) {
    const hash = await bcrypt.hash(u.password, 10);
    await User.create({ ...u, password: hash });
  }
  await Product.insertMany(products);
  console.log("Database seeded successfully!");
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
