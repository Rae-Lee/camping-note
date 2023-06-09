const Campsite = require('../models/campsites')
const Category = require('../models/categories')
const User = require('../models/users')
const Message = require('../models/messages')
const bigDecimal = require('js-big-decimal')
const { getOffset } = require('../helpers/pagination-helper')
const { getUser } = require('../helpers/auth-helpers')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { listenerCount } = require('../models/albums')
const campsiteService = {
  getCampsites: async req => {
    const DEFAULT_LIMIT = 9
    const categoryId = req.query.categoryId || ''
    const page = Number(req.query.page) || 1
    const offset = getOffset(DEFAULT_LIMIT, page)
    // get campsites
    let category
    if (categoryId !== '') {
      category = await Category.findById(categoryId).lean()
    }
    const campsites = await Campsite.find(
      categoryId ? { category: category.name } : {})
      .sort([['viewCount', 'desc']])
      .limit(DEFAULT_LIMIT)
      .skip(offset)
      .lean()
    // check user like campsite or not
    let likes = []
    if (getUser(req)) {
      const user = await User.findById(getUser(req)._id.valueOf())
      likes = user.like
    }
    const result = []
    for (const campsite of campsites) {
      const like = likes.includes(campsite._id)
      // check ratings
      let ratings = 0
      const messages = await Message.find({ campsiteId: campsite._id }) || []
      for (const message of messages) {
        ratings += Number(message.rating)
      }
      const account = messages.length === 0 ? '1' : messages.length.toString()
      result.push({
        ...campsite,
        like,
        ratings: Number(bigDecimal.divide(ratings.toString(), account, 1)) || 0,
        ratingAccount: messages.length
      })
    }
    return result
  },
  getCampsite: async req => {
    const id = req.params.id
    const campsite = await Campsite.findById(id).lean()
    await Campsite.replaceOne({ _id: id }, { ...campsite, viewCount: campsite.viewCount + 1 })
    // check user like campsite or not
    let likes = []
    if (getUser(req)) {
      const user = await User.findById(getUser(req)._id.valueOf())
      likes = user.like
    }
    campsite.like = likes.includes(campsite._id)
    // check ratings
    let ratings = 0
    const messages = await Message.find({ campsiteId: campsite._id }) || []
    for (const message of messages) {
      ratings += Number(message.rating)
    }
    const account = messages.length === 0 ? '1' : messages.length.toString()
    campsite.ratings = Number(bigDecimal.divide(ratings.toString(), account, 1)) || 0
    return campsite
  },
  getCount: async query => {
    const count = await Campsite.count(query)
    return count
  },
  postCampsite: async req => {
    const { name, county, town, location, googleMapWebsite, phone, website, category, reservation, price, description, attraction, driving, publicTransport, isLegal, isPublicOwn, isOpen } = req.body
    if (!name || !county || !town || !category || !req.file || !reservation || !price || !description || !isLegal || !isPublicOwn || !isOpen) throw new Error('Fields marked * are required!')
    const filePath = await imgurFileHandler(req.file)
    const campsite = await Campsite.create({
      name, county, town, location, googleMapWebsite, phone, website, category, reservation, price, description, attraction, driving, publicTransport, isLegal, isPublicOwn, isOpen, image: filePath
    })
    return campsite
  },
  getSearch: async req => {
    const DEFAULT_LIMIT = 9
    const page = Number(req.query.page) || 1
    const offset = getOffset(DEFAULT_LIMIT, page)
    const keyword = req.query.keyword
    const selectParams = { $or: [{ name: { $regex: keyword, $options: 'i' } }, { county: { $regex: keyword, $options: 'i' } }, { town: { $regex: keyword, $options: 'i' } }] }
    // get campsites
    const campsites = await Campsite.find(
      selectParams)
      .sort([['viewCount', 'desc']])
      .limit(DEFAULT_LIMIT)
      .skip(offset)
      .lean()
      // check user like campsite or not
    let likes = []
    if (getUser(req)) {
      const user = await User.findById(getUser(req)._id.valueOf())
      likes = user.like
    }
    const result = []
    for (const campsite of campsites) {
      const like = likes.includes(campsite._id)
      // check ratings
      let ratings = 0
      const messages = await Message.find({ campsiteId: campsite._id }) || []
      for (const message of messages) {
        ratings += Number(message.rating)
      }
      const account = messages.length === 0 ? '1' : messages.length.toString()
      result.push({
        ...campsite,
        like,
        ratings: Number(bigDecimal.divide(ratings.toString(), account, 1)) || 0,
        ratingAccount: messages.length
      })
    }
    return result
  }
}
module.exports = campsiteService
