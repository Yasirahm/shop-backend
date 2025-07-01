const express = require("express");
const router = express.Router();
const FormSubmission = require("../models/FormSubmission");

// ✅ Save any form
router.post("/submit", async (req, res) => {
  try {
    const { formType, data } = req.body;

    const newSubmission = new FormSubmission({ formType, data });
    await newSubmission.save();

    res.status(201).json({ message: "Form saved" });
  } catch (err) {
    console.error("❌ Save error:", err);
    res.status(500).json({ message: "Failed to save form" });
  }
});

// ✅ Get all forms
router.get("/all", async (req, res) => {
  try {
    const submissions = await FormSubmission.find().sort({ createdAt: -1 });
    res.json(submissions);
  } catch (err) {
    console.error("❌ Fetch error:", err);
    res.status(500).json({ message: "Failed to fetch forms" });
  }
});

module.exports = router;
