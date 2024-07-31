const express = require("express");
const router = express.Router();
const dsiteController = require('../controllers/donationsiteController')



router.get('/', dsiteController.dsite_index)
router.get('/use', dsiteController.anything_else)
router.get('/list', dsiteController.dsite_list)
router.post('/new', dsiteController.dsite_create)
router.put('/remove/:id', dsiteController.dsite_delete)
router.get('/:id/edit', dsiteController.dsite_edit)
router.put('/:id/update', dsiteController.dsite_update)
router.get('/:id/view', dsiteController.dsite_view)
router.put('/reactivate/:id', dsiteController.dsite_reactivate);

module.exports = router;