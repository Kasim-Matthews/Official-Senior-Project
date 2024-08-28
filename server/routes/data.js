const express = require("express");
const router = express.Router();

const cors = require('cors')
router.use(cors())
const dataController = require('../controllers/dataController')



router.get('/', dataController.data)

module.exports = router