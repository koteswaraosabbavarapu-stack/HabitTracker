const jwt = require('jsonwebtoken')
const User = require('../models/User')

const protect = async (req, res, next) => {
  try {
    // 1. check if token exists in header
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token, not authorized' })
    }

    // 2. extract token from "Bearer <token>"
    const token = authHeader.split(' ')[1]

    // 3. verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // 4. attach user to request object
    req.user = await User.findById(decoded.userId).select('-password')
    //                                               ↑
    //                              exclude password from result

    // 5. move to next function (the actual route handler)
    next()

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' })
    }
    return res.status(401).json({ message: 'Token not valid' })
  }
}

module.exports = { protect }