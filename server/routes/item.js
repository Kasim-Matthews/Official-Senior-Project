const express = require("express");
const router = express.Router();
const itemController = require('../controllers/itemController')
const cors = require('cors')
router.use(cors())


router.get('/', itemController.item_index)
router.post('/new', itemController.item_creation);

module.exports = router;