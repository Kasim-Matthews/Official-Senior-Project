const express = require("express");
const router = express.Router();
const itemController = require('../controllers/itemController')
const cors = require('cors')

router.use(cors())


router.get('/', itemController.item_index)
router.post('/new', itemController.item_creation);
router.put('/remove/:id', itemController.item_delete);
router.get('/:id/edit', itemController.item_edit)
router.get('/:id/view', itemController.item_view)
router.put('/:id/update', itemController.item_update)
router.get('/last', itemController.last)
router.post('/pair', itemController.pair)
module.exports = router;