const express = require("express");
const router = express.Router();
const FormSubmission = require("../models/FormSubmission");

// ✅ POST: Save any form (contact, callback, customize, checkout, etc.)
router.post("/submit", async (req, res) => {
  try {
    const { formType, data } = req.body;

    const newSubmission = new FormSubmission({ formType, data });
    await newSubmission.save();

    const adminEmail = process.env.EMAIL_USER;
    const userEmail = data.email;

    const htmlContent = `
      <h2>🛒 New Order Received</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Contact:</strong> ${data.contact}</p>
      <p><strong>Address:</strong> ${data.address}, ${data.district}, ${data.pincode}</p>
      <p><strong>Landmark:</strong> ${data.landmark}</p>
      ${data.razorpayPaymentId ? `<p><strong>Razorpay ID:</strong> ${data.razorpayPaymentId}</p>` : ""}
      <p><strong>Payment Method:</strong> ${data.paymentMethod}</p>
      <p><strong>Amount:</strong> ₹${data.amount}</p>
    `;

    await sendEmail([adminEmail, userEmail], `📦 Order Received - ${formType}`, htmlContent);

    res.status(201).json({ message: "✅ Order saved and email sent!" });
  } catch (err) {
    console.error("❌ Error in form submission:", err);
    res.status(500).json({ message: "❌ Failed to process order." });
  }
});

// ✅ GET: Fetch all forms
router.get("/all", async (req, res) => {
  try {
    const submissions = await FormSubmission.find().sort({ createdAt: -1 });
    res.json(submissions);
  } catch (err) {
    console.error("❌ Fetch error:", err);
    res.status(500).json({ message: "❌ Failed to fetch forms" });
  }
});

// ✅ DELETE: Remove a form by ID
router.delete("/:id", async (req, res) => {
  try {
    await FormSubmission.findByIdAndDelete(req.params.id);
    res.json({ message: "🗑️ Form deleted successfully" });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ message: "❌ Failed to delete form" });
  }
});

module.exports = router;
