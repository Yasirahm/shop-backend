const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const orderData = req.body;

    // ✅ Required fields validation
    const requiredFields = [
      "name",
      "email",
      "contact",
      "address",
      "district",
      "pincode",
      "landmark"
    ];

    for (const field of requiredFields) {
      if (!orderData[field]) {
        return res.status(400).json({ message: `Missing field: ${field}` });
      }
    }

    // If you were saving order to DB, you would do it here (optional)

    res.status(200).json({ message: "✅ Order received successfully." });
  } catch (error) {
    console.error("❌ Error in /checkout:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
