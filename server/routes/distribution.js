const express = require("express");
const router = express.Router();
const distributionController = require('../controllers/distributionController')
const cors = require('cors')

router.use(cors())


router.get('/', distributionController.distribution_index)
router.post('/new', distributionController.distribution_creation)

module.exports = router;