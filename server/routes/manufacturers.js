const express = require("express");
const router = express.Router();
const manufacturersController = require('../controllers/manufacturersController')
const cors = require('cors')

router.use(cors())


router.get('/', manufacturersController.manu_index)
router.get('/list', manufacturersController.manu_list)
router.post('/new', manufacturersController.manu_create);
router.delete('/remove/:id', manufacturersController.manu_delete);
router.get('/:id/edit', manufacturersController.manu_edit)
router.put('/:id/update', manufacturersController.manu_update)
router.get('/:id/view', manufacturersController.manu_view)

module.exports = router;