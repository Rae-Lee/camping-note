const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const messageController = require('../../controllers/message-controller')
const categoryController = require('../../controllers/category-controller')
const upload = require('../../middleware/multer')
// campsite
router.get('/campsites/create', adminController.createCampsite)
router.get('/campsites/search', adminController.getSearch)
router.get('/campsites/:id/edit', adminController.editCampsite)
router.get('/campsites/:id', adminController.getCampsite)
router.put('/campsites/:id', upload.single('image'), adminController.putCampsite)
router.delete('/campsites/:id', adminController.deleteCampsite)
router.get('/campsites', adminController.getCampsites)
router.post('/campsites', upload.single('image'), adminController.postCampsite)
// messages
router.delete('/messages/:id', adminController.deleteMessage)
// user
router.get('/users', adminController.getUsers)
router.patch('/users/:id', adminController.patchUser) 
// category
router.put('/categories/:id', categoryController.putCategory)
router.delete('/categories/:id', categoryController.deleteCategory)
router.get('/categories', categoryController.getCategories)
router.post('/categories', categoryController.postCategory)
router.use('/', (req, res) => res.redirect('/admin/campsites'))
module.exports = router
