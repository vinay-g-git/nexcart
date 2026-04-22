require("dotenv").config();
require("express-async-errors");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const authRoutes    = require("./routes/auth");
const productRoutes = require("./routes/products");
const cartRoutes    = require("./routes/cart");
const orderRoutes   = require("./routes/orders");
const reviewRoutes  = require("./routes/reviews");
const userRoutes    = require("./routes/users");

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000", credentials: true }));

app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

app.use(session({
  secret: process.env.SESSION_SECRET || "nexcart_secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
}));

app.use("/api/auth",     authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart",     cartRoutes);
app.use("/api/orders",   orderRoutes);
app.use("/api/reviews",  reviewRoutes);
app.use("/api/users",    userRoutes);

app.get("/api/health", (req, res) => res.json({
  status: "ok",
  services: { auth:"healthy", products:"healthy", cart:"healthy", orders:"healthy", reviews:"healthy" },
  uptime: process.uptime(),
  timestamp: new Date().toISOString(),
}));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/nexcart")
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log("NexCart API running on http://localhost:" + PORT));
  })
  .catch(err => { console.error("MongoDB error:", err.message); process.exit(1); });
