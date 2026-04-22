const protect = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: "Not authenticated. Please log in." });
  }
  req.userId = req.session.userId;
  next();
};

const adminOnly = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: "Not authenticated." });
  }
  if (req.session.role !== "admin") {
    return res.status(403).json({ error: "Admin access required." });
  }
  req.userId = req.session.userId;
  next();
};

module.exports = { protect, adminOnly };
