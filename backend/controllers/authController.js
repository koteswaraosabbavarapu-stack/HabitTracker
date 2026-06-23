const dotenv = require('dotenv')
dotenv.config() // load env vars before anything else
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { sendWelcomeEmail } = require('../utils/sendEmails')
// ─── Helper: generate JWT 

// ─── Generate Access Token (short lived) ─────────────────
const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  )
}

// ─── Generate Refresh Token (long lived) ─────────────────
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,    // different secret!
    { expiresIn: '7d' }
  )
}
const cookieOptions =() => ({
  
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // only send over HTTPS in production
    sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax', // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
})

const refreshAccessToken = async (req, res) => {
  try {
    // browser sends cookie automatically
    const token = req.cookies.refreshToken

    if (!token) {
      return res.status(401).json({ message: 'No refresh token' })
    }

    // verify refresh token
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET)

    // find user
    const user = await User.findById(decoded.userId)
    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }

    // generate new access token
    const newAccessToken = generateAccessToken(user._id, user.role)
    const newRefreshToken = generateRefreshToken(user._id)
    
    user.refreshToken = newRefreshToken
    await user.save()
    // update refresh token in cookie
    res.cookie('refreshToken', newRefreshToken, cookieOptions())

    res.json({ accessToken: newAccessToken })

  } catch (error) {
    return res.status(401).json({ message: 'Invalid refresh token' })
  }
}


const googleAuthCallback = async (req, res) => {
  try {
    // req.user is set by passport after Google login
    const user = req.user

    const accessToken = generateAccessToken(user._id, user.role)
    const refreshToken = generateRefreshToken(user._id)

    // save refresh token to DB
    user.refreshToken = refreshToken
    await user.save()

    // set cookie
    res.cookie('refreshToken', refreshToken, getCookieOptions())

    // redirect to frontend with accessToken in URL
    // frontend reads it and stores in memory
    res.redirect(
      `http://localhost:5173/auth/google/success?token=${accessToken}&name=${user.name}&email=${user.email}&role=${user.role}&id=${user._id}`
    )

  } catch (error) {
    res.redirect('http://localhost:5173/login?error=google_auth_failed')
  }
}


// ─── REGISTER ─────────────────────────────────────────────
// POST /api/auth/register
const registerUser = async (req, res) => {
  console.log(req.body)
  try {
    const { name, email, password } = req.body

    // 1. validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    // 2. check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    // 3. create user (pre-save hook hashes password automatically)
    const user = await User.create({ name, email, password })

    // ─── send welcome email ───────────────────────────────
    await sendWelcomeEmail(email, name)
    // if email fails — registration still succeeds
    // because we don't throw inside sendWelcomeEmail

    // 4. send back token immediately (user is logged in after register)
    const accessToken = generateAccessToken(user._id, user.role)

    const refreshToken=generateRefreshToken(user._id)
    // Save refresh token in user document
    user.refreshToken = refreshToken
    await user.save()
    
    res.cookie('refreshToken', refreshToken, cookieOptions())
    
    res.status(201).json({
      message: 'User registered successfully',
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })


  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// ─── LOGIN ────────────────────────────────────────────────
// POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    // 1. validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    // 2. find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }
    
     // ─── NEW: check if Google-only account ───────────────
    if (!user.password) {
      return res.status(401).json({
        message: 'This account uses Google login. Please sign in with Google.'
      })
    }
    // 3. check password using matchPassword method we made in topic 3
    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // 4. generate token
    const accessToken = generateAccessToken(user._id, user.role)
    const refreshToken = generateRefreshToken(user._id)
    
    // ─── save refresh token to DB ───────────────────────
    user.refreshToken = refreshToken
    await user.save()

    res.cookie('refreshToken', refreshToken, cookieOptions())
    res.status(200).json({
      message: 'Login successful',
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })

  } catch (error) {
  console.error('FULL ERROR:', error)  // ← add this
  res.status(500).json({ message: 'Server error', error: error.stack })  // stack not just message
}
}

const logoutUser = async (req, res) => {
  try {
    const token = req.cookies.refreshToken

    // Find the user by the refresh token
    const user = await User.findOne({ refreshToken: token })
    if (user) {
      user.refreshToken = null
      await user.save()
    }
  

    res.cookie('refreshToken', '', {
      httpOnly: true,
      expires: new Date(0)    // expire cookie immediately
    })
    res.json({ message: 'Logged out successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  googleAuthCallback
}