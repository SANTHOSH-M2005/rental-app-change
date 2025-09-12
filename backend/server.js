// server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// ---------- Import Routes ----------
const authRoutes = require("./routes/auth");
const vehicleRoutes = require("./routes/vehicles");
const rentalRoutes = require("./routes/rentals");
const saleRoutes = require("./routes/sales");
const favoriteRoutes = require("./routes/favorites");
const userRoutes = require("./routes/users"); // ✅ added here

// ---------- Initialize Database ----------
require("./database/database");

const app = express();
const PORT = process.env.PORT || 5000;

// ---------- Middleware ----------
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // serve static files

// ---------- Routes ----------
app.get("/", (req, res) => {
  res.send("🚀 API is running! Use /api/... endpoints.");
});

app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/users", userRoutes); // ✅ added cleanly

// ---------- Error Handling ----------
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// ---------- Start Server ----------
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
