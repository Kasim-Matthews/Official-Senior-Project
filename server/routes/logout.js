const router = require("./router");
const logoutController = require('../controllers/logoutController');


router.get('/', logoutController.handleLogout);

module.exports = router;