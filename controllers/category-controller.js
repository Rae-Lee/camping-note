const Category = require('../models/categories')
const categoryService = require('../services/category-service')
const categoryController = {
  getCategories: async (req, res, next) => {
    try {
      const categoryId = req.params.id
      const categories = await categoryService.getCategories()
      return res.render('admin/categories', {
        categories,
        categoryId
      })
    } catch (err) {
      next(err)
    }
  },
  postCategory: async (req, res, next) => {
    try {
      const { name } = req.body
      if (!name) throw new Error('Category name is required!')
      await Category.create({ name })
      return res.redirect('/admin/categories')
    } catch (err) {
      next(err)
    }
  },
  putCategory: async (req, res, next) => {
    try {
      const { name } = req.body
      if (!name) throw new Error('Category name is required!')
      const category = await Category.findById(req.params.id)
      if (!category) throw new Error("Category doesn't exist!")
      category.name = name
      await category.save()
      return res.redirect('/admin/categories')
    } catch (err) {
      next(err)
    }
  },
  deleteCategory: async (req, res, next) => {
    try {
      const category = await Category.findById(req.params.id)
      if (!category) throw new Error("Category didn't exist!") // 反查，確認要刪除的類別存在，再進行下面刪除動作
      category.name = '(未分類)'
      await category.save()
      return res.redirect('/admin/categories')
    } catch (err) {
      next(err)
    }
  }
}
module.exports = categoryController
