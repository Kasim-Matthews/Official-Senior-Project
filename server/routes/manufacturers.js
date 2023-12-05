const express = require("express");
const router = express.Router();
const manufacturersController = require('../controllers/manufacturersController')
const cors = require('cors')

router.use(cors())


router.get('/', manufacturersController.manufacturers_index)
router.post('/new', manufacturersController.manufacturers_creation);
router.delete('/remove/:id', manufacturersController.manufacturers_delete);
router.get('/:id/edit', manufacturersController.manufacturers_edit)
router.put('/:id/update', manufacturersController.manufacturers_update)

module.exports = router;