const Campsite = require('../models/campsites')
const User = require('../models/users')
const Category = require('../models/categories')
const campsiteServices = require('../services/campsite-services')
const categoryServices = require('../services/category-services')
const messageServices = require('../services/message-services')
const albumServices = require('../services/album-services')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { getPagination } = require('../helpers/pagination-helper')

const adminController = {
  getCampsites: async (req, res, next) => {
    try {
      const DEFAULT_LIMIT = 9
      const page = Number(req.query.page) || 1
      const categoryId = Number(req.query.categoryId) || ''
      const campsites = await campsiteServices.getCampsites(req)
      const categories = await categoryServices.getCategories()
      const count = await campsiteServices.getCount(categoryId ? { category: categoryId } : {})
      return res.render('admin/campsites', {
        campsites,
        categories,
        categoryId,
        pagination: getPagination(DEFAULT_LIMIT, page, count)
      })
    } catch (err) {
      next(err)
    }
  },
  createCampsite: async (req, res, next) => {
    try {
      const categories = await Category.find().lean()
      return res.render('admin/create-campsite', { categories })
    } catch (err) {
      next(err)
    }
  },
  postCampsite: async (req, res, next) => {
    try {
      await campsiteServices.posCampsite(req)
      req.flash('success_messages', 'Campsite was successfully created') // 在畫面顯示成功提示
      return res.redirect('/admin/campsites') // 新增完成後導回後台首頁
    } catch (err) {
      next(err)
    }
  },
  getCampsite: async (req, res, next) => {
    try {
      const DEFAULT_LIMIT = 9
      const page = Number(req.query.page) || 1
      const campsiteId = req.params.id
      const campsite = await campsiteServices.getCampsite(req)
      if (!campsite) throw new Error("Campsite didn't exist!")
      const messages = await messageServices.getMessages(req)
      const count = await messageServices.getCount({ campsiteId })
      const albums = await albumServices.getAlbums(req)
      campsite.viewCount++
      return res.render('campsite', {
        campsite,
        messages,
        pagination: getPagination(DEFAULT_LIMIT, page, count),
        albums
      })
    } catch (err) {
      next(err)
    }
  },
  editCampsite: async (req, res, next) => {
    try {
      const campsite = await Campsite.findById(req.params.id).lean()
      const categories = await Category.find().lean()
      if (!campsite) throw new Error("Campsite doesn't exist!")
      return res.render('admin/edit-restaurant', { campsite, categories })
    } catch (err) {
      next(err)
    }
  },
  putCampsite: async (req, res, next) => {
    try {
      const { name, country, town, location, googleMapWebsite, phone, website, category, reservation, price, description, attraction, feature, driving, publicTransport, isLegal, isPublicOwn, isOpen } = req.body
      if (!name || !country || !town || !category || !req.file) throw new Error('Fields marked * are required!')
      const campsite = await Campsite.findById(req.params.id)
      if (!campsite) throw new Error("Campsite doesn't exist!")
      const filePath = await imgurFileHandler(req.file)
      campsite.name = name
      campsite.country = country
      campsite.town = town
      campsite.location = location
      campsite.googleMapWebsite = googleMapWebsite
      campsite.phone = phone
      campsite.website = website
      campsite.category = category
      campsite.reservation = reservation
      campsite.price = price
      campsite.description = description
      campsite.attraction = attraction
      campsite.feature = feature
      campsite.driving = driving
      campsite.publicTransport = publicTransport
      campsite.isLegal = isLegal
      campsite.isPublicOwn = isPublicOwn
      campsite.isOpen = isOpen
      campsite.image = filePath
      req.flash('success_messages', 'Campsite was successfully to update')
      return res.redirect('/admin/campsites')
    } catch (err) {
      next(err)
    }
  },
  deleteCampsite: async (req, res, next) => {
    try {
      const campsiteId = req.params.id
      const campsite = await Campsite.findById(campsiteId)
      if (!campsite) throw new Error("Campsite doesn't exist!")
      await campsite.remove()
      req.flash('success_messages', 'Campsite was been deleted')
      return res.redirect('/admin/campsites')
    } catch (err) {
      next(err)
    }
  },
  getUsers: async (req, res, next) => {
    try {
      const users = await User.find().lean()
      return res.render('admin/users', { users })
    } catch (err) {
      next(err)
    }
  },
  // 變更用戶權限
  patchUser: async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id)
      if (!user) throw new Error("User didn't exist!")
      if (user.email === 'root@example.com') {
        req.flash('error_messages', '禁止變更 root 權限')
        return res.redirect('back')
      }
      await user.update({ isAdmin: !user.isAdmin })
      req.flash('success_messages', '使用者權限變更成功')
      return res.redirect('/admin/users')
    } catch (err) {
      next(err)
    }
  }
}
module.exports = adminController