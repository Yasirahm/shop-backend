const Order = require("../models/Order");
const User = require("../models/User");

// ✅ POST /api/orders - Place Order (for logged-in users)
const placeOrder = async (req, res) => {
  const { shippingInfo, totalAmount } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (!user || !user.cart || user.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty or user not found" });
    }

    const order = new Order({
      user: user._id,
      products: user.cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      })),
      totalAmount,
      shippingInfo
    });

    await order.save();

    user.cart = [];
    await user.save();

    res.status(201).json({ message: "✅ Order placed successfully", order });
  } catch (err) {
    res.status(500).json({ message: "❌ Order failed", error: err.message });
  }
};

// ✅ POST /api/orders/guest-orders - Place Guest Order (no login required)
const placeGuestOrder = async (req, res) => {
  const { shippingInfo, totalAmount, products } = req.body;

  if (!products || products.length === 0) {
    return res.status(400).json({ message: "Cart is empty." });
  }

  try {
    const order = new Order({
      products: products.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      })),
      totalAmount,
      shippingInfo,
      status: "Pending"
    });

    await order.save();

    res.status(201).json({ message: "✅ Guest order placed successfully", order });
  } catch (err) {
    console.error("❌ Guest order error:", err.message);
    res.status(500).json({ message: "❌ Failed to place guest order" });
  }
};

// ✅ GET /api/orders/my-orders - Fetch orders for logged-in user
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("products.productId");

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "❌ Failed to fetch user orders" });
  }
};

// ✅ GET /api/orders - Admin: All orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .populate("products.productId");

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "❌ Failed to fetch all orders" });
  }
};

module.exports = {
  placeOrder,
  placeGuestOrder,
  getUserOrders,
  getAllOrders,
};
