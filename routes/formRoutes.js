const express = require("express");
const router = express.Router();
const FormSubmission = require("../models/FormSubmission");

// ✅ POST: Save any form (contact, callback, customize, checkout, etc.)
router.post("/submit", async (req, res) => {
  try {
    const { formType, data } = req.body;

    const newSubmission = new FormSubmission({ formType, data });
    await newSubmission.save();

    res.status(201).json({ message: "✅ Form saved successfully" });
  } catch (err) {
    console.error("❌ Save error:", err);
    res.status(500).json({ message: "❌ Failed to save form" });
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
