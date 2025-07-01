const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    tag: { type: String },
    image: { type: String, required: true }, // URL
  },
  { timestamps: true }
);

module.exports = mongoose.model("Offer", offerSchema);
