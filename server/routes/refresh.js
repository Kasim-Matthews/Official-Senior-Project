const express = require('express');
const router = express.Router();
const refreshTokenController = require('../controllers/refreshTokenController');

router.get('/verifySession', refreshTokenController.handleRefreshToken);

module.exports = router;