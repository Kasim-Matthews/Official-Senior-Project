const express = require("express");
const router = express.Router();

const cors = require('cors')
router.use(cors())
const distributionController = require('../controllers/distributionController')


router.get('/', distributionController.distribution_index)
router.post('/new', distributionController.distribution_creation)
router.delete('/remove/:id', distributionController.distribution_remove)
router.get('/find_id', distributionController.distribution_find_id)
router.post('/find_ild', distributionController.distribution_find_ild)
router.post('/find_value', distributionController.distribution_find_value)
router.post('/track', distributionController.distribution_track)
router.get('/:id/view', distributionController.distribution_view)
router.get('/:id/itemlist', distributionController.distribution_itemlist)
router.get('/:id/edit', distributionController.distribution_edit)
router.get('/:id/edititems', distributionController.distribution_edit_items)
router.put('/:id/update', distributionController.distribution_update)
router.put('/take', distributionController.distribution_update_item)
router.put('/:id/complete', distributionController.distribution_complete)
router.put('/:id/incomplete', distributionController.distribution_incomplete)
router.get('/:id/cleanup', distributionController.distribution_cleanup)
router.put('/reclaim', distributionController.distribution_reclaim)
router.delete('/:id/edit_delete', distributionController.distribution_update_delete)
router.get('/:id/print', distributionController.distribution_print)
router.post('/validation', distributionController.validation)
router.post('/edit_validation', distributionController.edit_validation)
module.exports = router;