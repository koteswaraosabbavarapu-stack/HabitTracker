const dotenv = require('dotenv')
dotenv.config() // load env vars before anything else
const User = require('../models/User')
const jwt = require('jsonwebtoken')

// ─── Helper: generate JWT ─────────────────────────────────
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  )
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
    const token = generateToken(user._id, user.role)

    res.status(201).json({
      message: 'User registered successfully',
      token,
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
    const token = generateToken(user._id, user.role)

    res.status(200).json({
      message: 'Login successful',
      token,
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

module.exports = { registerUser, loginUser }