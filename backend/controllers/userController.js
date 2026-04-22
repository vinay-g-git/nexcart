const User = require("../models/User");

// @desc  Get all users (admin)
// @route GET /api/users
exports.getUsers = async (req, res) => {
  const users = await User.find({}).select("-password").sort({ createdAt: -1 });
  res.json(users);
};

// @desc  Get user by ID (admin)
// @route GET /api/users/:id
exports.getUser = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
};

// @desc  Update own profile
// @route PUT /api/users/profile
exports.updateProfile = async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  user.name    = req.body.name    || user.name;
  user.email   = req.body.email   || user.email;
  user.address = req.body.address || user.address;
  if (req.body.password) user.password = req.body.password;

  const updated = await user.save();
  res.json(updated.toSafeObject());
};

// @desc  Delete user (admin)
// @route DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User removed" });
};
