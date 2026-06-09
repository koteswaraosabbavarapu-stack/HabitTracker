const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  googleId: {
    type: String,
    unique: true,
},role:{
  type:String,
  enum:["user","admin"],
  default:"user"
}
},
 { timestamps: true }
);

// ─── Pre-save hook ───────────────────────────────────────
// runs automatically before every user.save()
userSchema.pre('save', async function (next) {

 try {
  // only hash if password was changed or is new
  if (!this.isModified('password')) return

  // skip if no password (Google login users)
  if (!this.password) return

  this.password = await bcrypt.hash(this.password, 10)
  
} catch (error) {
   throw error // pass error to next middleware
}})

// ─── Helper method on the model ──────────────────────────
// lets you do:  user.matchPassword("typed password")
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model('User', userSchema);