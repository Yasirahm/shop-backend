const Product = require("../models/Product");

// POST /api/products - Add product with file upload
const createProduct = async (req, res) => {
  try {
    const { name, description, price, discount, stock } = req.body;

    // Multer saves the file as req.file
    const imagePath = req.file ? req.file.path : "";

    const product = new Product({
      name,
      description,
      price,
      discount,
      stock,
      image: imagePath, // Save the file path
    });

    await product.save();
    res.status(201).json({ message: "✅ Product created", product });
  } catch (err) {
    console.error("❌ Error in createProduct:", err);
    res.status(500).json({ message: "❌ Failed to create product", error: err.message });
  }
};
