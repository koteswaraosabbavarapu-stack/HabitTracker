const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require('cookie-parser')


connectDB();
const app = express();
app.use(cors({
  origin: 'http://localhost:5173',   // ✅ exact frontend URL
  credentials: true                  // ✅ allows cookies
}))
app.use(express.json());
app.use(cookieParser())
app.use("/api/auth", authRoutes);

app.use("/api/habits", require("./routes/habitRoutes"));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});