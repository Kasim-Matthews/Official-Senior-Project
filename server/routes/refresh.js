const express = require('express');
const router = express.Router();
const refreshTokenController = require('../controllers/refreshTokenController');

const cookieParser = require('cookie-parser');
router.use(cookieParser());

const cors = require('cors')
router.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

router.get('/verifySession', refreshTokenController.handleRefreshToken);

module.exports = router;