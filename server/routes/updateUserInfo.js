const express = require('express');
const authController = require('../controllers/updateUserInfoController');

const router = express.Router();
const cors = require('cors')
router.use(cors())

router.post('/', authController.update_user_info);

module.exports = router;