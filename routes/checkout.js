const express = require("express");
const Razorpay = require("razorpay");
const router = express.Router();

// ✅ Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,      // use env vars, never hardcode!
  key_secret: process.env.RAZORPAY_SECRET,
});

// ✅ Create Razorpay Order and validate customer input
router.post("/", async (req, res) => {
  try {
    const orderData = req.body;

    // ✅ Validate required fields
    const requiredFields = [
      "name",
      "email",
      "contact",
      "address",
      "district",
      "pincode",
      "landmark",
      "amount"
    ];

    for (const field of requiredFields) {
      if (!orderData[field]) {
        return res.status(400).json({ message: `Missing field: ${field}` });
      }
    }

    // ✅ Create Razorpay order
    const options = {
      amount: orderData.amount * 100, // Razorpay takes amount in paise
      currency: "INR",
      receipt: `order_rcptid_${Math.floor(Math.random() * 1000000)}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // ✅ Respond with order info for frontend
    res.status(200).json({
      message: "✅ Razorpay order created",
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("❌ Razorpay order creation failed:", error);
    res.status(500).json({ message: "Server error while creating Razorpay order" });
  }
});

module.exports = router;
