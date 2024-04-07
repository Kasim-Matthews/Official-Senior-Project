const express = require("express");
const router = express.Router();
const dataController = require('../controllers/dataController')

const cors = require('cors')
router.use(cors())

router.get('/item-location-data', dataController.data)

module.exports = router