const db = require('../../config/mongoose.js')
const campsitesData = require('../../campsite.json')
const Campsite = require('../campsites')
const { faker } = require('@faker-js/faker')
db.once('open', async () => {
  try {
    for (const campsite of campsitesData) {
      const type = ['國家公園', '國家風景區', '國家森林遊樂區']
      let category = '私人土地'
      for (const i of type) {
        if (campsite[i] === '是') {
          category = i
          break
        }
      }
      await Campsite.create({
        id: campsite['編號'],
        name: campsite['露營場名稱'],
        county: campsite['縣市別'],
        town: campsite['鄉/鎮/市/區'],
        location: campsite['地址'],
        phone: campsite['電話'],
        website: campsite['網站\r'],
        image: `https://loremflickr.com/320/240/campsite/?random=${Math.random() * 2000}`,
        category,
        reservation: faker.lorem.text(),
        price: faker.lorem.text(),
        description: faker.lorem.text(),
        attraction: faker.lorem.text(),
        feature: faker.lorem.text(),
        driving: faker.lorem.text(),
        publicTransport: faker.lorem.text(),
        isLegal: campsite['違反相關法規'] ? 0 : 1,
        isPublicOwm: campsite['公有合法'] ? 1 : 0,
        isOpen: campsite['營業狀態'] === '營業中' ? 1 : 0,
        viewCount: Math.floor(Math.random() * 110) + 1300
      })
    }
    process.exit()
  } catch (err) {
    console.log(err)
  }
})
