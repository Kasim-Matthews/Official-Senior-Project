const express = require("express");
const router = express.Router();
const intakeController = require('../controllers/intakeController')

const cors = require('cors')
router.use(cors())

router.get('/', intakeController.data);
router.post('/new', intakeController.create);
router.delete('/remove/:id', intakeController.intake_remove)
router.post('/location', intakeController.location);
router.get('/:id/edit', intakeController.edit);
router.get('/find_id', intakeController.find_id);
router.post('/track', intakeController.track);
router.put('/update_item', intakeController.update_item);
router.get('/:id/view', intakeController.intake_view);
router.put('/:id/update', intakeController.update)
router.post('/find_value', intakeController.intake_find_value)
router.get('/:id/cleanup', intakeController.intake_cleanup)
router.put('/reclaim', intakeController.intake_reclaim)
router.get('/:id/edititems', intakeController.intake_edit_items)
router.delete('/:id/edit_delete', intakeController.intake_update_delete)
router.get('/misc', intakeController.intake_misc)

module.exports = router