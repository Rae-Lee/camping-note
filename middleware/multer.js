const multer = require('multer')
const upload = multer({
  dest: 'temp/',
  limit: { fileSize: 1000000 }
})
module.exports = upload
