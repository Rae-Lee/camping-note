const Message = require('../models/messages')
const User = require('../models/users')
const Campsite = require('../models/campsites')
const { getUser } = require('../helpers/auth-helpers')
const messageController = {
  postMessage: async (req, res, next) => {
    try {
      const { campsiteId, description, rating } = req.body
      const userId = getUser(req).id
      if (!description) throw new Error('Comment text is required!')
      const user = await User.findById(userId)
      const campsite = await Campsite.findById(campsiteId)
      if (!user) throw new Error("User didn't exist!")
      if (!campsite) throw new Error("Campsite didn't exist!")
      Message.create({
        campsiteId, description, rating, userId
      })
      return res.redirect(`/campsites/${campsiteId}`)
    } catch (err) {
      next(err)
    }
  },
  deleteMessage: async (req, res, next) => {
    try {
      const message = await Message.findById(req.params.id)
      if (!message) throw new Error("Comment didn't exist!")
      const deletedMessage = await message.remove()
      return res.redirect(`/campsites/${deletedMessage.campsiteId}`)
    } catch (err) {
      next(err)
    }
  }
}
module.exports = messageController
