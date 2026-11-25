const router = require('express').Router();
const controller = require('../controllers/receiptController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.post('/', controller.create);
router.delete('/:id', controller.remove);

module.exports = router;
