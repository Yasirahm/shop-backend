const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");
const {
  placeOrder,
  getUserOrders,
  getAllOrders,
} = require("../controllers/ordersController");

const Order = require("../models/Order");

// ✅ Guest Order Route (no login required)
router.post("/guest-orders", async (req, res) => {
  try {
    const { products, shippingInfo, totalAmount } = req.body;

    const newOrder = new Order({
      user: null, // Guest
      products,
      shippingInfo,
      totalAmount,
      status: "Pending",
    });

    await newOrder.save();
    res.status(201).json({ message: "✅ Guest order placed", order: newOrder });
  } catch (err) {
    console.error("❌ Guest Order Error:", err.message);
    res.status(500).json({ message: "❌ Failed to place guest order" });
  }
});

// ✅ Authenticated Routes
router.post("/", verifyToken, placeOrder);
router.get("/my-orders", verifyToken, getUserOrders);
router.get("/", verifyToken, getAllOrders);

module.exports = router;
