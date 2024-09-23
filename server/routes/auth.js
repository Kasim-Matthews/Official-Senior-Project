const router = require("./router");
const authController = require('../controllers/authController')



router.post('/login', authController.login);


module.exports = router