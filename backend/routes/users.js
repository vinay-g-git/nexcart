const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/auth");
const { getUsers, getUser, updateProfile, deleteUser } = require("../controllers/userController");

router.put("/profile", protect,  updateProfile);
router.get("/",       adminOnly, getUsers);
router.get("/:id",    adminOnly, getUser);
router.delete("/:id", adminOnly, deleteUser);

module.exports = router;
