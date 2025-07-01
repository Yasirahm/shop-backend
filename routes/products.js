const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const multer = require("multer");
const path = require("path");

// ✅ Multer Configuration for Image Upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });


// ✅ GET /api/products - Fetch all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error("❌ Failed to fetch products:", err.message);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});


// ✅ POST /api/products - Create new product with image upload
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, discount, stock } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const imagePath = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    const newProduct = new Product({
      name,
      description,
      price,
      discount,
      stock,
      image: imagePath,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error("❌ Error saving product:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
