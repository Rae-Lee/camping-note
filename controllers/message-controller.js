const Message = require('../models/messages')
const User = require('../models/users')
const Campsite = require('../models/campsites')
const { getUser } = require('../helpers/auth-helpers')
const messageController = {
  postMessage: async (req, res, next) => {
    try {
      const { campsiteId, description, rating } = req.body
      const userId = getUser(req)._id.valueOf()
      if (!description) throw new Error('Comment text is required!')
      if (description.length > 300) throw new Error('The number of characters exceeds the limit!')
      const user = await User.findById(userId)
      const campsite = await Campsite.findById(campsiteId)
      if (!user) throw new Error("User didn't exist!")
      if (!campsite) throw new Error("Campsite didn't exist!")
      Message.create({
        campsiteId, description, rating, user: user.name
      })
      return res.redirect(`/campsites/${campsiteId}`)
    } catch (err) {
      next(err)
    }
  }
}
module.exports = messageController
