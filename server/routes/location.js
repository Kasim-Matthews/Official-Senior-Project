const express = require("express");
const router = express.Router();
const locationController = require('../controllers/locationController')
const cors = require('cors')

router.use(cors())


router.get('/', locationController.location_index)
router.get('/use', locationController.anything_else)
router.post('/new', locationController.location_creation);
router.put('/remove/:id', locationController.location_delete);
router.get('/:id/edit', locationController.location_edit)
router.put('/:id/update', locationController.location_update)
router.get('/last', locationController.last)
router.post('/pair', locationController.pair)
router.get('/adjustment', locationController.adjustment)
router.post('/partner', locationController.partner)
router.put('/reactivate/:id', locationController.location_reactivate);
router.get('/:id/tab1', locationController.tab_1)
router.get('/:id/tab2', locationController.tab_2)
router.get('/:id/tab3', locationController.tab_3)
module.exports = router;