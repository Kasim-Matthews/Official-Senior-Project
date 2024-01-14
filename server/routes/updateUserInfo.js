const { Router } = require('express');
const authController = require('../controllers/updateUserInfoController');

const router = Router();
const cors = require('cors')
router.use(cors())

router.post('/', authController.login_post);

module.exports = router;