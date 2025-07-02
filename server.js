const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path");
const dotenv = require("dotenv");
const fs = require("fs");

dotenv.config();

// ✅ Routes
const formRoutes = require("./routes/forms");
const checkoutRoute = require("./routes/checkout");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orderRoutes");
const offerRoutes = require("./routes/offers");
const cartRoutes = require("./routes/cart");

const app = express();

// ✅ CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://newageversatilestudio.netlify.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Optional fallback for manual CORS headers (not strictly necessary)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

// ✅ Enable JSON parsing
app.use(express.json());

// ✅ Sessions (Important for login/authenticated routes)
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
      secure: true, // ⚠️ required for production HTTPS
      sameSite: "none", // ⚠️ required for Netlify + Render
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

// ✅ Serve uploads directory
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
app.use("/uploads", express.static(uploadsDir));

// ✅ Debug log
app.use((req, res, next) => {
  console.log(`🔍 ${req.method} ${req.url}`);
  next();
});

// ✅ Routes
app.use("/api/forms", formRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoute);

// ✅ Root route
app.get("/", (req, res) => {
  res.send("✅ Yasir's Shop Backend is Running on Render new ageversatile.netlify.app");
});

// ✅ Fallback 404
app.use((req, res) => {
  res.status(404).json({ error: "API route not found" });
});

// ✅ Connect to MongoDB and Start Server
mongoose
  .connect(process.env.MONGO_URI)
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
