const express = require("express");
const router = express.Router();
const partnerController = require('../controllers/partnerController')
const cors = require('cors')
router.use(cors())


router.get('/', partnerController.partner_index)
router.post('/new', partnerController.partner_create)
router.delete('/remove/:id', partnerController.partner_delete)
router.get('/:id/edit', partnerController.partner_edit)
router.put('/:id/update', partnerController.partner_update)
router.get('/:id/name', partnerController.partnerName)

module.exports = router;