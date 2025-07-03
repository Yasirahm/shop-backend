const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path");
const dotenv = require("dotenv");
const fs = require("fs");

dotenv.config();

const app = express();

// ✅ Load routes
const formRoutes = require("./routes/formRoutes"); // ✅ exact match with filename

const checkoutRoute = require("./routes/checkout");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orderRoutes");
const offerRoutes = require("./routes/offers");
const cartRoutes = require("./routes/cart");
const paymentRoute = require("./routes/payment");

// ✅ CORS Configuration
app.use(
  cors({
    origin: true, // ✅ Allow all origins (you can change this later)
    credentials: true,
  })
);


// Optional: fallback for manual CORS headers

// ✅ Middlewares
app.use(express.json());

// ✅ Session setup (MongoDB store)
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
      secure: true, // Required in production with HTTPS
      sameSite: "none", // Needed for Netlify-Render cross-domain cookies
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  })
);

// ✅ Serve static files
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use("/uploads", express.static(uploadsDir));

// ✅ Logging incoming requests
app.use((req, res, next) => {
  console.log(`🔍 ${req.method} ${req.url}`);
  next();
});

// ✅ API Routes
app.use("/api/forms", formRoutes);
app.use("/api/checkout", checkoutRoute);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoute);

// ✅ Root route
app.get("/", (req, res) => {
  res.send("✅ Yasir's Shop Backend is Running - NewAgeVersatile");
});


// ✅ 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: "API route not found" });
});


// ✅ Connect MongoDB and Start Server
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
