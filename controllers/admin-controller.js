const Campsite = require('../models/campsites')
const User = require('../models/users')
const Category = require('../models/categories')
const Message = require('../models/messages')
const campsiteServices = require('../services/campsite-service')
const messageServices = require('../services/message-service')
const albumServices = require('../services/album-service')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { getPagination } = require('../helpers/pagination-helper')

const adminController = {
  getCampsites: async (req, res, next) => {
    try {
      const DEFAULT_LIMIT = 9
      const page = Number(req.query.page) || 1
      const categoryId = req.query.categoryId || ''
      let category
      if (categoryId) {
        category = await Category.findById(categoryId).lean()
      }
      const campsites = await campsiteServices.getCampsites(req)
      const categories = await categoryServices.getCategories()
      const count = await campsiteServices.getCount(categoryId ? { category: category.name } : {})
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
  getSearch: async (req, res, next) => {
    try {
      const DEFAULT_LIMIT = 9
      const page = Number(req.query.page) || 1
      const keyword = req.query.keyword
      const selectParams = { $or: [{ name: { $regex: keyword, $options: 'i' } }, { county: { $regex: keyword, $options: 'i' } }, { town: { $regex: keyword, $options: 'i' } }] }
      if (!keyword) {
        return res.redirect('/admin')
      }
      const campsites = await campsiteServices.getSearch(req)
      const categories = await categoryServices.getCategories()
      const count = await campsiteServices.getCount(selectParams)
      return res.render('admin/campsites', {
        campsites,
        categories,
        categoryId: '',
        keyword,
        pagination: getPagination(DEFAULT_LIMIT, page, count)
      })
    } catch (err) {
      next(err)
    }
  },
  createCampsite: async (req, res, next) => {
    try {
      const categories = await Category.find().lean()
      const district = ['臺北市', '新北市', '桃園市', '臺中市', '臺南市', '高雄市', '宜蘭縣', '新竹縣', '苗栗縣', '彰化縣', '南投縣', '雲林縣', '嘉義縣', '屏東縣', '花蓮縣', '臺東縣', '澎湖縣', '基隆市', '新竹市', '嘉義市']
      return res.render('admin/create-campsite', { categories, district })
    } catch (err) {
      next(err)
    }
  },
  postCampsite: async (req, res, next) => {
    try {
      await campsiteServices.postCampsite(req)
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
      const district = ['臺北市', '新北市', '桃園市', '臺中市', '臺南市', '高雄市', '宜蘭縣', '新竹縣', '苗栗縣', '彰化縣', '南投縣', '雲林縣', '嘉義縣', '屏東縣', '花蓮縣', '臺東縣', '澎湖縣', '基隆市', '新竹市', '嘉義市']
      return res.render('admin/edit-campsite', { campsite, categories, district })
    } catch (err) {
      next(err)
    }
  },
  putCampsite: async (req, res, next) => {
    try {
      const { name, county, town, location, googleMapWebsite, phone, website, category, reservation, price, description, attraction, driving, publicTransport, isLegal, isPublicOwn, isOpen } = req.body
      if (!name || !county || !town || !category || !reservation || !price || !description || !isLegal || !isPublicOwn || !isOpen) throw new Error('Fields marked * are required!')
      const campsite = await Campsite.findById(req.params.id)
      if (!campsite) throw new Error("Campsite doesn't exist!")
      let filePath = ''
      if (req.file) {
        filePath = await imgurFileHandler(req.file)
      }
      campsite.name = name
      campsite.county = county
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
      campsite.driving = driving
      campsite.publicTransport = publicTransport
      campsite.isLegal = isLegal
      campsite.isPublicOwn = isPublicOwn
      campsite.isOpen = isOpen
      campsite.image = filePath || campsite.image
      await campsite.save()
      req.flash('success_messages', 'Campsite was successfully to update')
      return res.redirect('/admin/campsites')
    } catch (err) {
      next(err)
    }
  },
  deleteCampsite: async (req, res, next) => {
    try {
      const campsiteId = req.params.id
      const del = await Campsite.deleteOne({ _id: campsiteId })
      if (!del.deletedCount) throw new Error("Campsite doesn't exist!")
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
      user.isAdmin = !user.isAdmin
      await user.save()
      req.flash('success_messages', '使用者權限變更成功')
      return res.redirect('/admin/users')
    } catch (err) {
      next(err)
    }
  },
  deleteMessage: async (req, res, next) => {
    try {
      const del = await Message.deleteOne({ _id: req.params.id })
      if (!del.deletedCount) throw new Error("Comment didn't exist!")
      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  }
}
module.exports = adminController
