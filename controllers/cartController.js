const User = require("../models/User");
const Product = require("../models/Product");

// ✅ GET /api/cart — Get logged-in user's cart
const getUserCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cart.productId");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: "Error getting cart", error: err.message });
  }
};

// ✅ POST /api/cart/add — Add product to cart
const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const user = await User.findById(req.user.id);
    const product = await Product.findById(productId);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!product) return res.status(404).json({ message: "Product not found" });

    const existingItem = user.cart.find(item =>
      item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      user.cart.push({ productId, quantity: quantity || 1 });
    }

    await user.save();
    await user.populate("cart.productId");

    res.json({ message: "✅ Item added to cart", cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: "❌ Error adding to cart", error: err.message });
  }
};

// ✅ POST /api/cart/remove — Remove product from cart
const removeFromCart = async (req, res) => {
  const { productId } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.cart = user.cart.filter(item =>
      item.productId.toString() !== productId
    );

    await user.save();
    await user.populate("cart.productId");

    res.json({ message: "🗑️ Item removed from cart", cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: "❌ Error removing from cart", error: err.message });
  }
};

// ✅ Optional: Clear cart (use after successful checkout)
const clearUserCart = async (userId) => {
  const user = await User.findById(userId);
  if (user) {
    user.cart = [];
    await user.save();
  }
};

module.exports = {
  addToCart,
  removeFromCart,
  getUserCart,
  clearUserCart, // ⚠️ optional use in orderController
};
