const express = require("express");
const router = express.Router();
const dsiteController = require('../controllers/donationsiteController')
const cors = require('cors')
router.use(cors())


router.get('/', dsiteController.dsite_index)
router.get('/list', dsiteController.dsite_list)
router.post('/new', dsiteController.dsite_create)
router.put('/remove/:id', dsiteController.dsite_delete)
router.get('/:id/edit', dsiteController.dsite_edit)
router.put('/:id/update', dsiteController.dsite_update)

module.exports = router;