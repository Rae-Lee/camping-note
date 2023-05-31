const campsiteServices = require('../services/campsite-service')
const categoryServices = require('../services/category-service')
const messageServices = require('../services/message-service')
const albumServices = require('../services/album-service')
const { getPagination } = require('../helpers/pagination-helper')
const { getOffset } = require('../helpers/pagination-helper')
const Album = require('../models/albums')
const Campsite = require('../models/campsites')
const User = require('../models/users')
const Category = require('../models/categories')
const campsiteController = {
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
    const result = []
    for (const album of albums) {
      const userProfile = await User.findById(album.userId).lean()
      result.push({
        ...album,
        userProfile
      })
    }
    return res.render('feeds', {
      albums: result
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
      const result = campsites.map((campsite, index) => {
        return {
          ...campsite,
          description: `${campsite.description.slice(0, 100)}...`,
          rate: index + 1
        }
      }
      )
      return res.render('top-campsites', {
        campsites: result
      })
    } catch (err) {
      next(err)
    }
  },
  getTopAlbums: async (req, res, next) => {
    try {
      const DEFAULT_LIMIT = 10
      const albums = await Album.find()
        .sort({ viewCount: 'desc' })
        .limit(DEFAULT_LIMIT)
        .lean()
      const result = []
      for (const album of albums) {
        const userProfile = await User.findById(album.userId).lean()
        result.push({
          ...album,
          userProfile
        })
      }
      return res.render('top-albums', {
        albums: result
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
      await campsiteServices.postCampsite(req)
      req.flash('success_messages', 'restaurant was successfully created') // 在畫面顯示成功提示
      return res.redirect('campsites') // 新增完成後導回後台首頁
    } catch (err) {
      next(err)
    }
  },
  getAlbum: async (req, res, next) => {
    try {
      const DEFAULT_LIMIT = 12
      const page = Number(req.query.page) || 1
      const offset = getOffset(DEFAULT_LIMIT, page)
      const album = await Album.findById(req.params.id)
        .limit(DEFAULT_LIMIT)
        .skip(offset)
        .lean()
      return res.render('album', {
        album,
        pagination: getPagination(DEFAULT_LIMIT, page, album.photo.length)
      })
    } catch (err) {
      next(err)
    }
  }
}
module.exports = campsiteController
