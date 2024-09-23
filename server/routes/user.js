const router = require("./router");
const userController = require('../controllers/userController')




router.get('/:id', userController.data)
router.post('/:id/ue', userController.change_username_and_email)
router.post('/:id/cp', userController.change_password)

module.exports = router