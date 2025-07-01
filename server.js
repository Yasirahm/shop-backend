const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path");
const dotenv = require("dotenv");

// ✅ Load environment variables
dotenv.config();

const formRoutes = require("./routes/forms");
const checkoutRoute = require("./routes/checkout");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orderRoutes"); // ✅ Use only ONE order route
const offerRoutes = require("./routes/offers");
const cartRoutes = require("./routes/cart");

const app = express();

// ✅ Enable JSON body parsing
app.use(express.json());

// ✅ CORS - Allow Netlify Frontend
app.use(
  cors({
    origin: "https://newageversatilestudio.netlify.app", // 🔥 Use your frontend URL here
    credentials: true,
  })
);

// ✅ Session Management
app.use(
  session({
    secret: process.env.JWT_SECRET || "defaultsecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  })
);

// ✅ Static file hosting (images, etc.)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Define routes
app.use("/api/forms", formRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoute);

// ✅ Root Test Route
app.get("/", (req, res) => {
  res.send("✅ Yasir's Shop Backend is Running");
});

// ✅ Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
