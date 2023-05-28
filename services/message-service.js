const Message = require('../models/messages')
const messageService = {
  getMessages: async req => {
    const campsiteId = req.params.id
    const messages = await Message.find({ campsiteId }).lean()
    return messages
  },
  getCount: async query => {
    const count = await Message.count(query)
    return count
  }
}
module.exports = messageService
