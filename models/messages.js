const mongoose = require('mongoose')
const Schema = mongoose.Schema
const messageSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true
  },
  campsiteId: {
    type: Schema.Types.ObjectId,
    ref: 'Campsite',
    index: true,
    required: true
  },
  description: {
    type: String
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Message', messageSchema)