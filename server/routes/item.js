const express = require("express");
const router = express.Router();
const itemController = require('../controllers/itemController')
const cors = require('cors')

router.use(cors())


router.get('/', itemController.item_index)
router.post('/new', itemController.item_creation);
router.delete('/remove/:id', itemController.item_delete);
router.get('/:id/edit', itemController.item_edit)
router.put('/:id/update', itemController.item_update)

module.exports = router;