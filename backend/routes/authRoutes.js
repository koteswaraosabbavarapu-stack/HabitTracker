const express = require('express')
const router = express.Router()
const { registerUser, loginUser } = require('../controllers/authController')
const { protect,allowedTo } = require('../middleware/authMiddleware')

router.post('/register', registerUser)

router.post('/login', loginUser)

router.get("/me",protect,allowedTo('admin', 'user'), (req, res) => {
  res.json({
    message :'You are authorized',
    user: req.user
  })})

router.get('/admin', protect, allowedTo('admin'), (req, res) => {
  res.json({ message: `Welcome admin ${req.user.name}!` })
})
module.exports = router