const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyToken = async (req, res, next) => {
  const rawToken = req.headers["authorization"];

  // Token should be in format: Bearer tokenvalue
  const token = rawToken?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user || user.token !== token) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    req.user = user; // Attach full user object
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = { verifyToken };
