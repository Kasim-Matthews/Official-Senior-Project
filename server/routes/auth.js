const express = require("express");
const router = express.Router();
const authController = require('../controllers/authController')

const cors = require('cors')
router.use(cors())

router.post('/login', authController.login);


module.exports = router