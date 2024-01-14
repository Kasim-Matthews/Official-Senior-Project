const express = require("express");
const router = express.Router();
const intakeController = require('../controllers/intakeController')

const cors = require('cors')
router.use(cors())

router.get('/', intakeController.data);
router.post('/new', intakeController.create);
router.post('/location', intakeController.location);
router.get('/find_id', intakeController.find_id);
router.post('/track', intakeController.track);
router.post('/find_q', intakeController.find_q);
router.put('/update_item', intakeController.update);
router.get('/:id/view', intakeController.intake_view)

module.exports = router