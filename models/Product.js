const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
    },

    image: {
      type: String,
      required: [true, "Product image URL is required"],
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    stock: {
      type: Number,
      required: [true, "Product stock is required"],
      min: [0, "Stock cannot be negative"],
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

module.exports = mongoose.model("Product", productSchema);
  