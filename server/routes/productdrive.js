const router = require('./router')
const driveController = require('../controllers/productdriveController')


router.get('/', driveController.drive_index)
router.get('/use', driveController.anything_else)
router.get('/list', driveController.drive_list)
router.post('/new', driveController.drive_create)
router.put('/remove/:id', driveController.drive_delete)
router.get('/:id/edit', driveController.drive_edit)
router.put('/:id/update', driveController.drive_update)
router.get('/:id/view', driveController.drive_view)
router.put('/reactivate/:id', driveController.drive_reactivate);

module.exports = router;