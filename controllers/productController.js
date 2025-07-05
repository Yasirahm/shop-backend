const createProduct = async (req, res) => {
  try {
    const { name, description, price, discount, stock } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // ✅ Full image URL (use this in frontend)
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    const product = new Product({
      name,
      description,
      price,
      discount,
      stock,
      image: imageUrl, // ✅ full URL path
    });

    await product.save();
    res.status(201).json({ message: "✅ Product created", product });
  } catch (err) {
    console.error("❌ Error in createProduct:", err);
    res.status(500).json({ message: "❌ Failed to create product", error: err.message });
  }
};
