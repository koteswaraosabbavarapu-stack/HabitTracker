const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../models/User')

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      // this function runs after Google sends user info
      try {
        // profile contains user info from Google:
        // profile.id         → googleId
        // profile.emails[0]  → email
        // profile.displayName → name

        // check if user already exists
        let user = await User.findOne({ googleId: profile.id })

        if (user) {
          // user exists → just return them
          return done(null, user)
        }

        // check if email already registered with password
        user = await User.findOne({ email: profile.emails[0].value })

        if (user) {
          // link google to existing account
          user.googleId = profile.id
          await user.save()
          return done(null, user)
        }

        // new user → create account
        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          // no password — google login
        })

        return done(null, user)

      } catch (error) {
        return done(error, null)
      }
    }
  )
)

// needed for passport session
passport.serializeUser((user, done) => {
  done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id)
  done(null, user)
})

module.exports = passport