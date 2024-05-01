const express = require("express");
const router = express.Router();

const cors = require('cors')
router.use(cors())
const donationController = require('../controllers/donationController')



router.get('/', donationController.data);
router.post('/new', donationController.create);
router.delete('/remove/:id', donationController.intake_remove)
router.post('/location', donationController.location);
router.get('/:id/edit', donationController.edit);
router.get('/find_id', donationController.find_id);
router.post('/track', donationController.track);
router.put('/update_item', donationController.update_item);
router.get('/:id/view', donationController.intake_view);
router.put('/:id/update', donationController.update)
router.post('/find_value', donationController.intake_find_value)
router.get('/:id/cleanup', donationController.intake_cleanup)
router.put('/reclaim', donationController.intake_reclaim)
router.get('/:id/edititems', donationController.intake_edit_items)
router.delete('/:id/edit_delete', donationController.intake_update_delete)
router.get('/misc', donationController.intake_misc)
router.post('/validation', donationController.validation)

module.exports = router