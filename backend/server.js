// Import required packages
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require("./routes/authRoutes");

// Use routes
app.use("/api/auth", authRoutes);

// Default route
app.get("/", (req, res) => {
    res.send("Academic Vault Backend Running 🚀");
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.log("❌ DB Error:", err));

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
