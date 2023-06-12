const express = require('express')
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
const SESSION_SECRET = process.env.SESSION_SECRET || 'MySecretName'
const app = express()
const port = process.env.PORT || 3000
const MONGODB_URI = process.env.MONGODB_URI
require('./config/mongoose.js')
app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages') // 設定 success_msg 訊息
  res.locals.error_messages = req.flash('error_messages') // 設定 error_msg 訊息
  res.locals.warning_messages = req.flash('warning_messages')
  res.locals.user = getUser(req)
  next()
})
app.use(methodOverride('_method'))
app.use('/upload', express.static(path.join(__dirname, 'upload')))// 建立虛擬路徑字首
app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
