const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser')
dotenv.config();
const session = require('express-session')
const passport = require('./config/passport')
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");


app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

connectDB();
const app = express();
app.use(cors({
  origin: 'http://localhost:5173',   // ✅ exact frontend URL
  credentials: true                  // ✅ allows cookies
}))
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);

app.use("/api/habits", require("./routes/habitRoutes"));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});