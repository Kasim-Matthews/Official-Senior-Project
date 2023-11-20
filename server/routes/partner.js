const express = require("express");
const router = express.Router();
const partnerController = require('../controllers/partnerController')
const cors = require('cors')
router.use(cors())


router.get('/', partnerController.partner_index)
router.post('/add', partnerController.partner_create)

module.exports = router;