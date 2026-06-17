const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const { registerUser, loginUser,refreshAccessToken,logoutUser,googleAuthCallback} = require('../controllers/authController')
const { protect,allowedTo } = require('../middleware/authMiddleware')

router.post('/register', registerUser)

router.post('/login', loginUser)


// ─── Google OAuth routes ──────────────────────────────────

// Step 1 — redirect to Google
router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']   // what we want from Google
  })
)

// Step 2 — Google redirects back here
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  googleAuthCallback
)


router.post('/logout', logoutUser)

router.post('/refresh', refreshAccessToken);
router.get("/me",protect,allowedTo('admin', 'user'), (req, res) => {
  res.json({
    message :'You are authorized',
    user: req.user
  })})

router.get('/admin', protect, allowedTo('admin'), (req, res) => {
  res.json({ message: `Welcome admin ${req.user.name}!` })
})
module.exports = router