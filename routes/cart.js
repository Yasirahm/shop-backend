const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");
const {
  addToCart,
  removeFromCart,
  getUserCart
} = require("../controllers/cartController");

// All routes below need login
router.use(verifyToken);

router.get("/", getUserCart);
router.post("/add", addToCart);
router.post("/remove", removeFromCart);

module.exports = router;
