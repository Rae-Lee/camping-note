const Category = require('../models/categories')
const categoryService = {
  getCategories: async () => {
    const categories = await Category.find().lean()
    return categories
  }
}
module.exports = categoryService