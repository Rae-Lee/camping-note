const mongoose = require('mongoose')
const Schema = mongoose.Schema
const albumSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true
  },
  campsiteId: {
    type: Schema.Types.ObjectId,
    ref: 'Campsite',
    required: true
  },
  description: {
    type: String
  },
  photo: {
    type: Array,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  viewCount: {
    type: Number,
    default: 0
  }
})

module.exports = mongoose.model('Album', albumSchema)
