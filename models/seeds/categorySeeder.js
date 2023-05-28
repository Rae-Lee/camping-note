const db = require('../../config/mongoose.js')
const Category = require('../categories')
db.once('open', async () => {
  try {
    const categories = ['私人土地', '國家公園', '國家風景區', '國家森林遊樂區']
    for (const category of categories) {
      await Category.create({
        name: category
      })
    }
    process.exit()
  } catch (err) {
    console.log(err)
  }
})
