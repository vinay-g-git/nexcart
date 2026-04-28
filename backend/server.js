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

app.set('trust proxy', 1);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const normalizeOrigin = (url) => {
  if (!url) return url;
  return url.trim().replace(/\/$/, "");
};

const allowedOrigins = process.env.CLIENT_URL 
  ? process.env.CLIENT_URL.split(',').map(url => normalizeOrigin(url))
  : ["http://localhost:3000"];

app.use(cors({ 
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(normalizeOrigin(origin))) {
      return callback(null, true);
    }
    callback(new Error("CORS policy: Origin not allowed"));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false }));

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
