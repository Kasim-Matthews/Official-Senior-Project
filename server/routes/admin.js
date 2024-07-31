const express = require("express");
const router = express.Router();
const adminController = require('../controllers/adminController')
const ROLE_LIST = require('../config/roleslist')
const verifyRole = require('../middleware/verifyRole')



router.get('/', verifyRole(ROLE_LIST.Admin), adminController.data);
router.delete('/remove/:id', verifyRole(ROLE_LIST.Admin), adminController.del);


module.exports = router