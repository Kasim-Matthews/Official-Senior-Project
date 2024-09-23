const router = require("./router");
const itemController = require('../controllers/itemController')



router.get('/', itemController.item_index)
router.get('/use', itemController.anything_else)
router.post('/new', itemController.item_creation);
router.put('/remove/:id', itemController.item_delete);
router.get('/:id/edit', itemController.item_edit)
router.get('/:id/view', itemController.item_view)
router.put('/:id/update', itemController.item_update)
router.get('/last', itemController.last)
router.post('/pair', itemController.pair)
router.get('/tab2', itemController.tab2)
router.put('/reactivate/:id', itemController.item_reactivate);
module.exports = router;