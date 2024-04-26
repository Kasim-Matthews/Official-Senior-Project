const router = require('./router')
const transferController = require('../controllers/transferController')



router.get('/', transferController.transfer)
router.get('/:id/view', transferController.transfer_view)
router.get('/:id/info', transferController.transfer_info)
router.get('/adjustment', transferController.adjustment)
router.put('/give', transferController.give)
router.put('/take', transferController.takeaway)
router.post('/values', transferController.find_value)
router.post('/ild', transferController.find_ild)
router.post('/track', transferController.track_intake)
router.get('/:id/cleanup', transferController.transfer_cleanup)
router.put('/reclaim', transferController.transfer_reclaim)
router.put('/renounce', transferController.transfer_renounce)
router.post('/validation', transferController.validation)
module.exports = router;