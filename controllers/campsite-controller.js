const campsiteServices = require('../services/campsite-services')
const categoryServices = require('../services/category-services')
const messageServices = require('../services/message-services')
const albumServices = require('../services/album-services')
const { getPagination } = require('../helpers/pagination-helper')
const Album = require('../models/albums')
const Campsite = require('../models/campsites')
const campsiteController = {
  getCampsites: async (req, res, next) => {
    try {
      const DEFAULT_LIMIT = 9
      const page = Number(req.query.page) || 1
      const categoryId = Number(req.query.categoryId) || ''
      const campsites = await campsiteServices.getCampsites(req)
      const categories = await categoryServices.getCategories()
      const count = await campsiteServices.getCount(categoryId ? { category: categoryId } : {})
      return res.render('campsites', {
        campsites,
        categories,
        categoryId,
        pagination: getPagination(DEFAULT_LIMIT, page, count)
      })
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
  // 最新相簿
  getFeeds: async (req, res, next) => {
    const DEFAULT_LIMIT = 8
    const albums = await Album.find()
      .sort({ createdAt: 'desc' })
      .limit(DEFAULT_LIMIT)
      .lean()
    return res.render('feeds', {
      albums
    })
  },
  // 瀏覽次數最高的相簿及餐廳
  getTopCampsites: async (req, res, next) => {
    try {
      const DEFAULT_LIMIT = 10
      const campsites = await Campsite.find()
        .sort({ viewCount: 'desc' })
        .limit(DEFAULT_LIMIT)
        .lean()
      const albums = await Album.find()
        .sort({ viewCount: 'desc' })
        .limit(DEFAULT_LIMIT)
        .lean()
      return res.render('top-campsites', {
        campsites,
        albums
      })
    } catch (err) {
      next(err)
    }
  },
  createCampsite: async (req, res, next) => {
    try {
      const categories = await categoryServices.getCategories()
      return res.render('create-campsite', { categories })
    } catch (err) {
      next(err)
    }
  },
  postCampsite: async (req, res, next) => {
    try {
      await campsiteServices.posCampsite(req)
      req.flash('success_messages', 'restaurant was successfully created') // 在畫面顯示成功提示
      return res.redirect('campsites') // 新增完成後導回後台首頁
    } catch (err) {
      next(err)
    }
  }
}
module.exports = campsiteController
