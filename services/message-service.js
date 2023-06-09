const Message = require('../models/messages')
const User = require('../models/users')
const { getOffset } = require('../helpers/pagination-helper')
const messageService = {
  getMessages: async req => {
    const DEFAULT_LIMIT = 9
    const campsiteId = req.params.id
    const page = Number(req.query.page) || 1
    const offset = getOffset(DEFAULT_LIMIT, page)
    const messages = await Message.find({ campsiteId })
      .sort([['createdAt', 'desc']])
      .limit(DEFAULT_LIMIT)
      .skip(offset)
      .lean()
    const result = []
    for (const message of messages) {
      const userProfile = await User.findOne({ name: message.user }).lean()
      result.push({
        ...message,
        userProfile
      })
    }
    return result
  },
  getCount: async query => {
    const count = await Message.count(query)
    return count
  }
}
module.exports = messageService
