const multer = require("multer");
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// 🔧 multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// 🆕 POST product with image
router.post("/", upload.single("image"), async (req, res) => {
  const { name, description, price, discount, stock } = req.body;
  const image = req.file?.path;

  try {
    const newProduct = new Product({
      name,
      description,
      price,
      discount,
      stock,
      image,
    });

    await newProduct.save();
    res.json(newProduct);
  } catch (err) {
    res.status(500).json({ message: "Error adding product", error: err.message });
  }
});
