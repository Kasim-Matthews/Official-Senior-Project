const express = require("express");
const router = express.Router();

const cors = require('cors')
router.use(cors())

const auditController = require('../controllers/auditController')



router.get('/', auditController.index);
router.get('/:id/view', auditController.view)
router.get('/inventory', auditController.inventory);
router.post('/log', auditController.log)
router.post('/new', auditController.create)
router.get('/last', auditController.last)
router.put('/update', auditController.update)

module.exports = router