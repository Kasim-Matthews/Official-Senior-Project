const express = require("express");
const router = express.Router();
const registerController = require('../controllers/registerController')

const cors = require('cors')
router.use(cors())

router.post('/register', registerController.register);

module.exports = router