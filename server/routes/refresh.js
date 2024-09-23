const router = require("./router");
const refreshTokenController = require('../controllers/refreshTokenController');


router.get('/', refreshTokenController.handleRefreshToken);

module.exports = router;