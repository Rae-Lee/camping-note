const mongoose = require('mongoose')
const Schema = mongoose.Schema
const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    enum: ['私人土地', '國家公園', '國家風景區', '國家森林遊樂區']
  }
})

module.exports = mongoose.model('Category', categorySchema)