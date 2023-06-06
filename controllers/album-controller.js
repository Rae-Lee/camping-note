const { getPagination } = require('../helpers/pagination-helper')
const { getOffset } = require('../helpers/pagination-helper')
const { getUser } = require('../helpers/auth-helpers')
const { imgurFileHandler } = require('../helpers/file-helpers')
const Album = require('../models/albums')
const Campsite = require('../models/campsites')
const User = require('../models/users')
const albumController = {
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
  // 瀏覽次數最高的相簿
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
  getAlbum: async (req, res, next) => {
    try {
      const DEFAULT_LIMIT = 12
      const page = Number(req.query.page) || 1
      const offset = getOffset(DEFAULT_LIMIT, page)
      const album = await Album.findById(req.params.id)
        .lean()
      const count = album.photo.length
      album.photo = album.photo.slice(offset, DEFAULT_LIMIT)
      return res.render('album', {
        album,
        pagination: getPagination(DEFAULT_LIMIT, page, count)
      })
    } catch (err) {
      next(err)
    }
  },
  createAlbum: async (req, res, next) => {
    try {
      const campsites = await Campsite.find()
        .select({ name: 1 })
        .lean()
      return res.render('create-album', {
        campsites
      })
    } catch (err) { next(err) }
  },
  postAlbum: async (req, res, next) => {
    try {
      const { name, campsiteId, description, userId } = req.body
      if (!name) throw new Error('Fields marked * are required!')
      if (!req.files.image) throw new Error('Photos and cover uploaded are required!')
      if (!campsiteId) throw new Error(' Please choose an existing campsite!')
      if (name.length > 50 || description.length > 300) throw new Error('The number of characters exceeds the limit!')
      const cover = await imgurFileHandler(req.files.image[0])
      const photo = []
      for (const file of req.files.photo) {
        const link = await imgurFileHandler(file)
        photo.push(link)
      }
      await Album.create({
        name,
        userId,
        campsiteId,
        description,
        cover,
        photo
      })
      req.flash('success_messages', 'album was successfully created') // 在畫面顯示成功提示
      return res.redirect(`/users/${userId}`) // 新增完成後導回後台個人檔案
    } catch (err) {
      next(err)
    }
  },
  editAlbum: async (req, res, next) => {
    try {
      const album = await Album.findById(req.params.id).lean()
      if (!album) throw new Error("Album doesn't exist!")
      const campsites = await Campsite.find()
        .select({ name: 1 })
        .lean()
      const campsite = await Campsite.findById(album.campsiteId).lean()
      return res.render('edit-album', { album, campsites, campsite: campsite.name, stringPhoto: JSON.stringify(album.photo) })
    } catch (err) {
      next(err)
    }
  },
  putAlbum: async (req, res, next) => {
    try {
      const album = await Album.findById(req.params.id)
      if (!album) throw new Error("Campsite doesn't exist!")
      const { name, campsiteId, description, existPhoto } = req.body
      if (!name) throw new Error('Fields marked * are required!')
      if (!campsiteId) throw new Error(' Please choose an existing campsite!')
      if (name.length > 50 || description.length > 300) throw new Error('The number of characters exceeds the limit!')
      let cover = ''
      if (req.files.image) {
        cover = await imgurFileHandler(req.files.image[0])
      }
      const photo = JSON.parse(existPhoto)
      if (req.files.image) {
        for (const file of req.files.photo) {
          const link = await imgurFileHandler(file)
          photo.push(link)
        }
      }
      album.name = name
      album.description = description
      album.cover = cover || album.cover
      album.campsiteId = campsiteId
      album.photo = photo
      await album.save()
      req.flash('success_messages', 'Album was successfully to update') // 在畫面顯示成功提示
      return res.redirect(`/albums/${album._id}`) // 新增完成後導回後台個人檔案
    } catch (err) {
      next(err)
    }
  },
  deleteAlbum: async (req, res, next) => {
    try {
      const albumId = req.params.id
      const del = await Album.deleteOne({ _id: albumId })
      if (!del.deletedCount) throw new Error("Album doesn't exist!")
      req.flash('success_messages', 'Album was been deleted')
      return res.redirect(`/users/${getUser(req)._id}`)
    } catch (err) {
      next(err)
    }
  }
}
module.exports = albumController
