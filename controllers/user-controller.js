const bcrypt = require('bcryptjs')
const { getUser } = require('../helpers/auth-helpers')
const { imgurFileHandler } = require('../helpers/file-helpers')
const User = require('../models/users')
const Album = require('../models/albums')
const Campsite = require('../models/campsites')
const userController = {
  signUpPage: (req, res) => res.render('signup'),
  signUp: async (req, res, next) => {
    try {
      const { name, email, password, passwordCheck } = req.body
      if (!name || !email || !password) throw new Error('All fields are required')
      if (password !== passwordCheck) throw new Error('Passwords do not match!')
      const user = await User.findOne({ email })
      if (user) throw new Error('Email already exists!')
      const hash = await bcrypt.hash(password, 10)
      await User.create({
        name,
        email,
        password: hash
      })
      req.flash('success_messages', '成功註冊帳號！')
      return res.redirect('/signin')
    } catch (err) {
      next(err)
    }
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('back')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/campsites')
  },
  getUser: async (req, res, next) => {
    try {
      const userId = req.params.id
      const viewUser = await User.findById(userId).lean()
      const albums = await Album.find({ userId }).lean()
      if (!viewUser) throw new Error('User is not exist!')
      return res.render('users/profile', { viewUser, albums })
    } catch (err) {
      next(err)
    }
  },
  editUser: async (req, res, next) => {
    try {
      const userId = req.params.id
      if (userId !== getUser(req).id) throw new Error('Permission denied!')
      const user = User.findById(userId).lean()
      if (!user) throw new Error('User does not exist!')
      return res.render('users/edit', { user })
    } catch (err) {
      next(err)
    }
  },
  putUser: async (req, res, next) => {
    try {
      const userId = req.params.id
      if (userId !== getUser(req).id) throw new Error('Permission denied!')
      const user = await User.findById(userId)
      if (!user) throw new Error('User does not exist!')
      const { name } = req.body
      if (!name) throw new Error('User name is required!')
      const image = await imgurFileHandler(req.file)
      user.name = name
      user.image = image
      await user.save()
      req.flash('success_messages', '使用者資料編輯成功')
      return res.redirect(`/users/${userId}`)
    } catch (err) {
      next(err)
    }
  },
  addLike: async (req, res, next) => {
    try {
      const campsiteId = req.params.id
      const campsite = await Campsite.findById(campsiteId)
      if (!campsite) throw new Error("Campsite didn't exist!")
      // 加入到使用者喜愛清單
      const user = await User.findById(getUser(req).id)
      if (user.like.includes(campsiteId)) throw new Error('You have liked this restaurant!')
      user.like.push({ campsiteId })
      await user.save()
      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  removeLike: async (req, res, next) => {
    try {
      const campsiteId = req.params.id
      const campsite = await Campsite.findById(campsiteId)
      if (!campsite) throw new Error("Campsite didn't exist!")
      // 從使用者喜愛清單中移除
      const user = await User.findById(getUser(req).id)
      if (!user.like.includes(campsiteId)) throw new Error("You haven't like this restaurant!")
      const result = user.like.filter(l => l !== campsiteId)
      user.like = result
      await user.save()
      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  }
}
module.exports = userController
