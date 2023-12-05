const express = require("express");
const router = express.Router();
const locationController = require('../controllers/locationController')
const cors = require('cors')

router.use(cors())


router.get('/', locationController.location_index)
router.post('/new', locationController.location_creation);
router.delete('/remove/:id', locationController.location_delete);
router.get('/:id/edit', locationController.location_edit)
router.put('/:id/update', locationController.location_update)

module.exports = router;