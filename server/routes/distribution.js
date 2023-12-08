const express = require("express");
const router = express.Router();
const distributionController = require('../controllers/distributionController')
const cors = require('cors')

router.use(cors())


router.get('/', distributionController.distribution_index)
router.post('/new', distributionController.distribution_creation)
router.delete('/remove/:id', distributionController.distribution_remove)
router.get('/:id/edit', distributionController.distribution_edit)
router.put('/:id/update', distributionController.distribution_update)
module.exports = router;