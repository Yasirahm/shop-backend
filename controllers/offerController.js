const Offer = require("../models/Offer");

// POST /api/offers
const addOffer = async (req, res) => {
  const { title, description, image } = req.body;

  try {
    const newOffer = new Offer({ title, description, image });
    await newOffer.save();
    res.status(201).json({ message: "Offer created", offer: newOffer });
  } catch (err) {
    res.status(500).json({ message: "Failed to create offer", error: err.message });
  }
};

// GET /api/offers
const getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 });
    res.json(offers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching offers" });
  }
};

module.exports = { addOffer, getAllOffers };
