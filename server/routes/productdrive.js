const express = require("express");
const router = express.Router();
const driveController = require('../controllers/productdriveController')
const cors = require('cors')
router.use(cors())

router.get('/', driveController.drive_index)
router.get('/list', driveController.drive_list)
router.post('/new', driveController.drive_create)
router.put('/remove/:id', driveController.drive_delete)
router.get('/:id/edit', driveController.drive_edit)
router.put('/:id/update', driveController.drive_update)
router.get('/:id/view', driveController.drive_view)

module.exports = router;