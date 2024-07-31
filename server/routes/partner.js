const express = require("express");
const router = express.Router();
const partnerController = require('../controllers/partnerController')



router.get('/', partnerController.partner_index)
router.get('/use', partnerController.anything_else)
router.get('/list', partnerController.partner_list)
router.get('/options', partnerController.partner_options)
router.post('/new', partnerController.partner_create)
router.put('/remove/:id', partnerController.partner_delete)
router.get('/:id/edit', partnerController.partner_edit)
router.put('/:id/update', partnerController.partner_update)
router.get('/:id/view', partnerController.partner_view)
router.get('/types', partnerController.partner_types)
router.put('/reactivate/:id', partnerController.partner_reactivate);

module.exports = router;