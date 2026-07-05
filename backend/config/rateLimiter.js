// config/rateLimiter.js
const rateLimit = require('express-rate-limit')

// ─── General limiter — all routes ────────────────────────
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,    // 15 minutes window
  max: 100,                     // max 100 requests per IP
  message: {
    message: 'Too many requests from this IP, try again after 15 minutes'
  },
  standardHeaders: true,        // sends rate limit info in headers
  legacyHeaders: false
})

// ─── Strict limiter — auth routes ─────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,    // 15 minutes window
  max: 100,                    // only 10 login attempts per IP
  message: {
    message: 'Too many login attempts, try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false
})

module.exports = { generalLimiter, authLimiter }