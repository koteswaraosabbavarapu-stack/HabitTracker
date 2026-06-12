const dotenv = require('dotenv')
dotenv.config() // load env vars before anything else
const User = require('../models/User')
const jwt = require('jsonwebtoken')

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

    res.json({ accessToken: newAccessToken })

  } catch (error) {
    return res.status(401).json({ message: 'Invalid refresh token' })
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

    // 4. send back token immediately (user is logged in after register)
    const accessToken = generateAccessToken(user._id, user.role)

    const refreshToken=generateRefreshToken(user._id)
    
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false, // only send over HTTPS in production
      sameSite: 'Strict', // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })
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

    // 3. check password using matchPassword method we made in topic 3
    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // 4. generate token
    const accessToken = generateAccessToken(user._id, user.role)
    const refreshToken = generateRefreshToken(user._id)

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false, // only send over HTTPS in prod
      sameSite: 'Strict', // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })
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
  res.cookie('refreshToken', '', {
    httpOnly: true,
    expires: new Date(0)    // expire cookie immediately
  })
  res.json({ message: 'Logged out' })
}

module.exports = { registerUser, loginUser,refreshAccessToken, logoutUser }