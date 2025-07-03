const express = require("express");
const router = express.Router();
const FormSubmission = require("../models/FormSubmission");

// ✅ POST /api/forms/submit - Save form data
router.post("/submit", async (req, res) => {
  try {
    const { formType, data } = req.body;

    if (!formType || !data) {
      return res.status(400).json({ error: "Form type and data are required" });
    }

    const newSubmission = new FormSubmission({ formType, data });
    await newSubmission.save();

    res.status(200).json({ message: "✅ Form submitted successfully" });
  } catch (err) {
    console.error("❌ Error saving form submission:", err.message);
    res.status(500).json({ error: "Failed to submit form" });
  }
});

// ✅ GET /api/forms/all - Fetch all submissions (Admin Panel)
router.get("/all", async (req, res) => {
  try {
    const submissions = await FormSubmission.find().sort({ createdAt: -1 });
    res.status(200).json(submissions);
  } catch (err) {
    console.error("❌ Error fetching forms:", err.message);
    res.status(500).json({ error: "Failed to fetch form submissions" });
  }
});

// ✅ DELETE /api/forms/:id - Delete a form by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await FormSubmission.findByIdAndDelete(id);
    res.status(200).json({ message: "✅ Submission deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting form:", err.message);
    res.status(500).json({ error: "Failed to delete form" });
  }
});

module.exports = router;
