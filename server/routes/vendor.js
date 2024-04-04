const express = require("express");
const router = express.Router();
const vendorController = require('../controllers/vendorController')
const cors = require('cors')
router.use(cors())


router.get('/', vendorController.vendor_index)
router.get('/list', vendorController.vendor_list)
router.post('/new', vendorController.vendor_create)
router.put('/remove/:id', vendorController.vendor_delete)
router.get('/:id/edit', vendorController.vendor_edit)
router.put('/:id/update', vendorController.vendor_update)
router.get('/:id/view', vendorController.vendor_view)

module.exports = router;