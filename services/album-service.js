const Album = require('../models/albums')
const albumService = {
  getAlbums: async req => {
    const campsiteId = req.params.id
    const albums = await Album.find({ campsiteId })
      .sort([['viewCount', 'desc']])
      .limit(4)
      .lean()
    return albums
  },
  getCount: async query => {
    const count = await Album.count(query)
    return count
  }
}
module.exports = albumService
