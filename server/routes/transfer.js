const express = require("express");
const router = express.Router();
const transferController = require('../controllers/transferController')
const cors = require('cors')

router.use(cors())


router.get('/', transferController.transfer)
router.get('/:id/view', transferController.transfer_view)
router.get('/adjustment', transferController.adjustment)
router.put('/give', transferController.give)
router.put('/take', transferController.takeaway)
router.post('/values', transferController.find_value)
router.post('/ild', transferController.find_ild)
router.post('/track', transferController.track_intake)
router.get('/:id/cleanup', transferController.transfer_cleanup)
router.put('/reclaim', transferController.transfer_reclaim)
router.put('/renounce', transferController.transfer_renounce)
module.exports = router;