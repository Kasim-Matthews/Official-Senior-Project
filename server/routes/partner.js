const express = require("express");
const router = express.Router();
const partnerController = require('../controllers/partnerController')
const cors = require('cors')
router.use(cors())


router.get('/', partnerController.partner_index)
router.post('/new', partnerController.partner_create)
router.delete('/remove/:id', partnerController.partner_delete)

module.exports = router;