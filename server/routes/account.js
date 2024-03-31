const express = require("express");
const router = express.Router();
const accountController = require('../controllers/accountController')

const cors = require('cors')
router.use(cors())

router.post('/register', accountController.register);
router.post('/login', accountController.login);
router.get('/item-location-data', accountController.data)

module.exports = router