const express = require("express");
const router = express.Router();
const distributionController = require('../controllers/distributionController')
const cors = require('cors')

router.use(cors())


router.get('/', distributionController.distribution_index)
router.post('/new', distributionController.distribution_creation)
router.delete('/remove/:id', distributionController.distribution_remove)
router.post('/find_id', distributionController.distribution_find_id)
router.post('/find_q', distributionController.distribution_find_q)
router.post('/find_ild', distributionController.distribution_find_ild)
router.post('/find_value', distributionController.distribution_find_value)
router.post('/track', distributionController.distribution_track)
router.get('/:id/view', distributionController.distribution_edit)
router.put('/:id/update', distributionController.distribution_update)
router.put('/update_item', distributionController.distribution_update_item)
module.exports = router;