const router = require('express').Router();
const controller = require('./roleController');
const auth = require('../../middleware/auth');
const { adminOnly } = require('../../middleware/rbac');

router.use(auth);

router.get('/', controller.getAll);
router.post('/', adminOnly, controller.create);
router.put('/:id', adminOnly, controller.update);
router.delete('/:id', adminOnly, controller.remove);

module.exports = router;
