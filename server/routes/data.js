const router = require('./router')
const dataController = require('../controllers/dataController')



router.get('/', dataController.data)

module.exports = router