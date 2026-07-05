const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()
const cookieParser = require('cookie-parser')
const session = require('express-session')
const helmet = require('helmet')
// const mongoSanitize = require('express-mongo-sanitize')
// const xss = require('xss-clean')
const hpp = require('hpp')
const passport = require('./config/passport')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const habitRoutes = require('./routes/habitRoutes')
const { generalLimiter, authLimiter } = require('./config/rateLimiter')
const validateEnv = require('./config/validateEnv')


validateEnv()
connectDB()

const app = express()

// ─── 1. CORS first ────────────────────────────────────────
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

// ─── 2. Helmet after CORS ─────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false    // ← disable CSP — breaks OAuth redirects
}))

// ─── 3. Body parsing ──────────────────────────────────────
app.use(express.json({ limit: '10kb' }))
app.use(cookieParser())

// ─── 4. Security middleware ───────────────────────────────
// app.use(mongoSanitize({
//   allowDots: true,
//   replaceWith: '_'
// }))
// app.use(xss())
app.use(hpp())
app.use(generalLimiter)

// ─── 5. Session + Passport ───────────────────────────────
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}))
app.use(passport.initialize())
app.use(passport.session())

// ─── 6. Routes ────────────────────────────────────────────
// add before routes
app.get('/api/auth/google/test', (req, res) => {
  res.json({
    clientID: process.env.GOOGLE_CLIENT_ID ? 'loaded' : 'missing',
    secret: process.env.GOOGLE_CLIENT_SECRET ? 'loaded' : 'missing',
    callback: process.env.GOOGLE_CALLBACK_URL
  })
})
app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/habits', habitRoutes)


// ─── 7. Global error handler ──────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    message: process.env.NODE_ENV === 'production'
      ? 'Something went wrong'
      : err.message
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))