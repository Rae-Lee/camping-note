const Album = require('../models/albums')
const albumService = {
  getAlbums: async req => {
    const campsiteId = req.params.id
    const albums = await Album.find({ campsiteId })
      .sort({ createdAt: 'desc' })
      .limit(4)
      .lean()
    return albums
  }
}
module.exports = albumService
