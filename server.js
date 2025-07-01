const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path");
const dotenv = require("dotenv");
const formRoutes = require("./routes/forms");
const checkoutRoute = require("./routes/checkout"); // ✅ import checkout route

dotenv.config();

const app = express();

// ✅ Middleware
app.use(express.json());

// ✅ CORS (Allow frontend access with cookies/session)
app.use(
  cors({
    origin: "http://localhost:5173", // Your React frontend URL
    credentials: true,
  })
);

// ✅ Express-session middleware
app.use(
  session({
    secret: process.env.JWT_SECRET,
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

// ✅ Serve uploaded image files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ API Routes
app.use("/api/forms", formRoutes);

app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/offers", require("./routes/offers"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/checkout", checkoutRoute); // ✅ route for invoice-based checkout

// 🛠 Test Route
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
