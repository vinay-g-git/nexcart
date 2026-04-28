const User = require("../models/User");

// @desc  Register
// @route POST /api/auth/register
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ error: "Email already registered" });

  const avatar = name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  const user = await User.create({ name, email, password, avatar });

  req.session.userId = user._id.toString();
  req.session.role = user.role;

  res.status(201).json({ user: user.toSafeObject() });
};

// @desc  Login
// @route POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  req.session.userId = user._id.toString();
  req.session.role = user.role;

  res.json({ user: user.toSafeObject() });
};

// @desc  Logout
// @route POST /api/auth/logout
exports.logout = (req, res) => {
  res.clearCookie("connect.sid");
  req.session.destroy(err => {
    if (err) console.error("Session destroy error:", err);
    res.json({ message: "Logged out successfully" });
  });
};

// @desc  Get current user
// @route GET /api/auth/me
exports.me = async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ user: user.toSafeObject() });
};
