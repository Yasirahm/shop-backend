const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const router = express.Router();

const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  console.error("❌ Razorpay keys are missing in environment variables.");
  process.exit(1);
}

const razorpayInstance = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || typeof amount !== "number") {
      return res.status(400).json({
        success: false,
        message: "Invalid amount. It must be a number in paise.",
      });
    }

    const options = {
      amount, // amount in paise directly
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);

    return res.status(200).json({
      success: true,
      order,
    });

  } catch (err) {
    console.error("Razorpay Order Creation Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order",
      error: err.message,
    });
  }
});

module.exports = router;
