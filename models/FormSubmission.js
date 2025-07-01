const mongoose = require("mongoose");

const FormSubmissionSchema = new mongoose.Schema({
  formType: String, // e.g., "contact", "checkout"
  data: Object,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("FormSubmission", FormSubmissionSchema);
