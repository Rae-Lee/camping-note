const db = require('../../config/mongoose.js')
const campsitesData = require('../../campsite.json')
const usersData = require('../../user.json').results
const { faker } = require('@faker-js/faker')
const bcrypt = require('bcryptjs')
const Campsite = require('../campsites')
const User = require('../users')
const Album = require('../albums')
const Message = require('../messages')
const campsitesQuantity = campsitesData.length
db.once('open', async () => {
  try {
    const campsites = await Campsite.find()
    for (const user of usersData) {
      if (user.isAdmin === false) {
        // 新增用戶種子資料
        const { name, email, password, isAdmin, image } = user
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        const like = []
        for (let i = 0; i <= 9; i++) {
          const temp = campsites[Math.floor(Math.random() * campsitesQuantity)]._id
          like.push(temp)
        }
        const data = await User.create({ name, email, password: hash, like, isAdmin, image })
        console.log('user done')
        // 新增相簿種子資料
        const albums = []
        const photo = []
        for (let i = 0; i <= 9; i++) {
          photo.push(`https://loremflickr.com/320/240/tent,flower/?random=${Math.random() * 2000}`)
        }
        for (let i = 0; i < campsitesQuantity; i++) {
          albums.push({
            name: faker.lorem.lines(1),
            userId: data._id,
            campsiteId: campsites[i],
            description: faker.lorem.text(),
            cover: `https://loremflickr.com/320/240/tent,flower/?random=${Math.random() * 2000}`,
            photo,
            viewCount: Math.floor(Math.random() * 400) + 100
          })
        }
        await Album.create(albums)
        console.log('album done')
        // 新增訊息種子資料
        const messages = []
        const rating = [3, 4, 5]
        for (let i = 1; i <= (campsitesQuantity / 2); i++) {
          messages.push({
            user: data.name,
            campsiteId: campsites[Math.floor(Math.random() * campsitesQuantity)],
            description: faker.lorem.lines(2),
            rating: rating[Math.floor(Math.random() * rating.length)]
          })
        }
        await Message.create(messages)
        console.log('message done')
      } else {
        // 新增管理者種子資料
        const { name, email, password, isAdmin, image } = user
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        await User.create({ name, email, password: hash, isAdmin, image })
        console.log('user done')
      }
    }
    console.log('all done')
    process.exit()
  } catch (err) {
    console.log(err)
  }
})
