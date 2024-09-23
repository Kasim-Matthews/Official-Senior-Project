const router = require("./router");
const registerController = require('../controllers/registerController')



router.post('/register', registerController.register);

module.exports = router