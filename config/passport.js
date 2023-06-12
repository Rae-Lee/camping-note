const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const bcrypt = require('bcryptjs')
const User = require('../models/users')
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET
const FACEBOOK_APP_CALLBACK = process.env.FACEBOOK_APP_CALLBACK
// set up Passport strategy
passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  // authenticate user
  (req, email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) return done(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
        bcrypt.compare(password, user.password)
          .then(res => {
            if (!res) return done(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
            return done(null, user)
          })
      })
  }
))
// serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id)
})
passport.deserializeUser((id, done) => {
  User.findById(id)
    .lean()
    .then(user => {
      return done(null, user)
    })
    .catch(err => done(err))
})
// facebook strategy
passport.use(new FacebookStrategy(
  {
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: FACEBOOK_APP_CALLBACK,
    profileFields: ['displayName', 'email']
  }, (accessToken, refreshToken, profile, done) => {
    const { name, email } = profile._json
    const { photos } = profile
    User.findOne({ email })
      .then(user => {
        if (user) { return done(null, user) }
        const password = Math.random().toString(36).slice(-8)
        return bcrypt.genSalt(10)
          .then(salt => bcrypt.hash(password, salt))
          .then(hash => {
            User.create({ name, email, password: hash, image: photos[0].value })
              .then(user => { return done(null, user) })
              .catch(err => done(err))
          })
          .catch(err => done(err))
      })
      .catch(err => done(err))
  }
))
module.exports = passport
