const { Restaurant, User, Category } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const adminServices = {
  getRestaurants: (req, cb) => {
    Restaurant.findAll({ raw: true, nest: true, include: [Category] })
      .then(restaurants => cb(null, { restaurants }))
      .catch(err => cb(err))
  },
  deleteRestaurant: (req, cb) => { // 新增以下
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (!restaurant) {
          const err = new Error("Restaurant didn't exist!")
          err.status = 404 // 客戶端出錯
          throw err
        }
        return restaurant.destroy()
      })
      .then(deleteRestaurant => cb(null, { restaurant: deleteRestaurant }))
      .catch(err => cb(err))
  }
}
module.exports = adminServices
