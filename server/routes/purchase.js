const express = require("express");
const router = express.Router();
const purchaseController = require('../controllers/purchaseController')

const cors = require('cors')
router.use(cors())

router.get('/', purchaseController.data);
router.post('/new', purchaseController.create);
router.delete('/remove/:id', purchaseController.purchase_remove)
router.post('/location', purchaseController.location);
router.get('/:id/edit', purchaseController.edit);
router.get('/find_id', purchaseController.find_id);
router.post('/track', purchaseController.track);
router.put('/update_item', purchaseController.update_item);
router.get('/:id/view', purchaseController.purchase_view);
router.put('/:id/update', purchaseController.update)
router.get('/:id/cleanup', purchaseController.purchase_cleanup)
router.put('/reclaim', purchaseController.purchase_reclaim)
router.get('/:id/edititems', purchaseController.purchase_edit_items)
router.delete('/:id/edit_delete', purchaseController.purchase_update_delete)

module.exports = router