const router = require('./router')
const vendorController = require('../controllers/vendorController')



router.get('/', vendorController.vendor_index)
router.get('/use', vendorController.anything_else)
router.get('/list', vendorController.vendor_list)
router.post('/new', vendorController.vendor_create)
router.put('/remove/:id', vendorController.vendor_delete)
router.get('/:id/edit', vendorController.vendor_edit)
router.put('/:id/update', vendorController.vendor_update)
router.get('/:id/view', vendorController.vendor_view)
router.put('/reactivate/:id', vendorController.vendor_reactivate);

module.exports = router;