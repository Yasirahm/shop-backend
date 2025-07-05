const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const dotenv = require("dotenv");

dotenv.config();

// ✅ Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Multer + Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "shop-products", // ✅ optional folder name in Cloudinary
    allowed_formats: ["jpeg", "jpg", "png", "webp"],
    transformation: [{ width: 800, height: 800, crop: "limit" }],
  },
});

const upload = multer({ storage });

// ✅ GET /api/products - Fetch all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error("❌ Failed to fetch products:", err.message);
    res.status(500).json({
      message: "🚧 We're working on server issues. Please try again shortly.",
    });
  }
});

// ✅ POST /api/products - Create new product with image upload to Cloudinary
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, discount, stock } = req.body;

    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "Image upload failed" });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      discount,
      stock,
      image: req.file.path, // ✅ Cloudinary returns secure URL
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error("❌ Error saving product:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
