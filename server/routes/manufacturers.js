const express = require("express");
const router = express.Router();

const cors = require('cors')
router.use(cors())
const manufacturersController = require('../controllers/manufacturersController')



router.get('/', manufacturersController.manu_index)
router.get('/use', manufacturersController.anything_else)
router.get('/list', manufacturersController.manu_list)
router.post('/new', manufacturersController.manu_create);
router.put('/remove/:id', manufacturersController.manu_delete);
router.get('/:id/edit', manufacturersController.manu_edit)
router.put('/:id/update', manufacturersController.manu_update)
router.get('/:id/view', manufacturersController.manu_view)
router.put('/reactivate/:id', manufacturersController.manu_reactivate);

module.exports = router;