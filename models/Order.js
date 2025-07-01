const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false, // ✅ Make user optional for guest orders
  },

  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      }
    }
  ],

  totalAmount: {
    type: Number,
    required: true,
  },

  shippingInfo: {
    name: {
      type: String,
      required: true,
    },
    email: String,
    contact: String,
    address: String,
    district: String,
    pincode: String,
    landmark: String,
  },

  status: {
    type: String,
    default: "Pending", // Can be updated to "Shipped", "Delivered", etc.
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
