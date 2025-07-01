const express = require("express");
const router = express.Router();
const Offer = require("../models/Offer");
const multer = require("multer");
const path = require("path");

// ✅ Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// ✅ GET All Offers
router.get("/", async (req, res) => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 });
    res.json(offers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch offers" });
  }
});

// ✅ POST Offer with Image
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    const image = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    const offer = new Offer({ title, description, tag, image });
    await offer.save();
    res.status(201).json(offer);
  } catch (err) {
    res.status(500).json({ error: "Failed to create offer" });
  }
});

module.exports = router;
