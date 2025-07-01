const express = require("express");
const router = express.Router();
const { getAllOrders, placeOrder } = require("../controllers/ordersController");
const { verifyToken } = require("../middlewares/authMiddleware");
const Order = require("../models/Order");

// ✅ Place order as guest (no login required)
router.post("/guest-orders", async (req, res) => {
  try {
    const { products, shippingInfo, totalAmount } = req.body;

    const newOrder = new Order({
      user: null, // No user (guest)
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

// ✅ Place order (for logged-in users)
router.post("/", verifyToken, placeOrder);

// ✅ Get all orders (admin access - add verifyToken later if needed)
router.get("/", getAllOrders); // Optional: add verifyToken here

module.exports = router;
