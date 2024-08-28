const express = require("express");
const router = express.Router();

const cors = require('cors')
router.use(cors())
const registerController = require('../controllers/registerController')



router.post('/register', registerController.register);

module.exports = router