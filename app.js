const express = require('express')
const app = express()
const path = require('path')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const handlebars = require('express-handlebars')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('./config/passport')
const routes = require('./routes')
const handlebarsHelpers = require('./helpers/handlebars-helpers')
const { getUser } = require('./helpers/auth-helpers')
const PORT = process.env.PORT || 8080
const MONGODB_URI = process.env.MONGODB_URI
const GOOGLE_KEY = process.env.GOOGLE_KEY
require('./config/mongoose.js')
app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')
app.use(session({
  secret: 'MySecretName',
  resave: false,
  saveUninitialized: false
}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages') // 設定 success_msg 訊息
  res.locals.error_messages = req.flash('error_messages') // 設定 error_msg 訊息
  res.locals.warning_messages = req.flash('warning_messages')
  res.locals.user = getUser(req)
  res.locals.GOOGLE_KEY = GOOGLE_KEY
  next()
})
app.use(methodOverride('_method'))
app.use('/upload', express.static(path.join(__dirname, 'upload')))// 建立虛擬路徑字首
app.use(routes)

app.listen(PORT, () => {
  console.info(`Example app listening on port ${PORT}!`)
})

module.exports = app
