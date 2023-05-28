const Campsite = require('../models/campsites')
const Category = require('../models/categories')
const { getOffset } = require('../helpers/pagination-helper')
const { getUser } = require('../helpers/auth-helpers')
const { imgurFileHandler } = require('../helpers/file-helpers')
const campsiteService = {
  getCampsites: async req => {
    const DEFAULT_LIMIT = 9
    const categoryId = Number(req.query.categoryId) || ''
    const page = Number(req.query.page) || 1
    const offset = getOffset(DEFAULT_LIMIT, page)
    // get campsites
    const category = await Category.findById(categoryId)
    const campsites = await Campsite.find(
      categoryId ? { category: category.name } : {})
      .limit(DEFAULT_LIMIT)
      .skip(offset)
      .lean()
    // check user like campsite or not
    const likes = getUser(req).like
    campsites.map(async campsite => {
      const like = likes.includes(campsite._id)
      return {
        ...campsite,
        like
      }
    })
    return campsites
  },
  getCampsite: async req => {
    const id = req.params.id
    const campsite = await Campsite.findById(id).lean()
    const likes = getUser(req).like
    campsite.like = likes.includes(campsite._id)
    return campsite
  },
  getCount: async query => {
    const count = await Campsite.count(query)
    return count
  },
  postCampsite: async req => {
    const { name, country, town, location, googleMapWebsite, phone, website, category, reservation, price, description, attraction, feature, driving, publicTransport, isLegal, isPublicOwn, isOpen } = req.body
    if (!name || !country || !town || !category || !req.file) throw new Error('Fields marked * are required!')
    const filePath = await imgurFileHandler(req.file)
    const campsite = await Campsite.create({
      name, country, town, location, googleMapWebsite, phone, website, category, reservation, price, description, attraction, feature, driving, publicTransport, isLegal, isPublicOwn, isOpen, image: filePath
    })
    return campsite
  }
}
module.exports = campsiteService
