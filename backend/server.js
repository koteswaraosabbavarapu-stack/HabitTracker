const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const passport = require('./config/passport')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const habitRoutes = require('./routes/habitRoutes')
const { generalLimiter, authLimiter } = require('./config/rateLimiter')
const validateEnv = require('./config/validateEnv')

dotenv.config()

// validate env vars before anything else
validateEnv()

connectDB()

const app = express()

// ─── Security Middleware ───────────────────────────────────
app.use(helmet())                    // security headers
app.use(mongoSanitize())             // NoSQL injection protection
app.use(xss())                       // XSS protection
app.use(hpp())                       // HTTP parameter pollution
app.use(generalLimiter)              // rate limit all routes

// ─── Core Middleware ───────────────────────────────────────
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(express.json({ limit: '10kb' }))    // body size limit
app.use(cookieParser())

// ─── Session + Passport ───────────────────────────────────
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000    // 1 day
  }
}))
app.use(passport.initialize())
app.use(passport.session())

// ─── Routes ───────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes)    // strict limit on auth
app.use('/api/habits', habitRoutes)

// ─── Global Error Handler ─────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    message: process.env.NODE_ENV === 'production'
      ? 'Something went wrong'     // hide error details in production
      : err.message                // show details in development
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))