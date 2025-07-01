const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ✅ REGISTER USER
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashed });

    await newUser.save();

    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error during registration" });
  }
};

// ✅ LOGIN USER WITH SESSION
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Set session
    req.session.userId = user._id;

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error during login" });
  }
};

// ✅ LOGOUT USER (DESTROY SESSION)
const logoutUser = async (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.clearCookie("connect.sid"); // clear session cookie
    res.json({ message: "Logged out successfully" });
  });
};

module.exports = { registerUser, loginUser, logoutUser };
