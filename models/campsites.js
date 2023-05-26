const mongoose = require('mongoose')
const Schema = mongoose.Schema
const campSiteSchema = new Schema({
  id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  town: {
    type: String,
    required: true
  },
  location: {
    type: String
  },
  googleMapWebsite: {
    type: String
  },
  phone: {
    type: String
  },
  website: {
    type: String
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['私人土地', '國家公園', '國家風景區', '國家森林遊樂區']
  },
  reservation: {
    type: String
  },
  price: {
    type: String
  },
  description: { type: String },
  attraction: { type: String },
  feature: { type: String },
  driving: { type: String },
  publicTransport: { type: String },
  isLegal: {
    type: Boolean,
    default: false
  },
  isPublicOwn: {
    type: Boolean,
    default: false
  },
  isOpen: {
    type: Boolean,
    default: true
  }
})

module.exports = mongoose.model('Campsite', campSiteSchema)
