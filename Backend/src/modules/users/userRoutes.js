const router = require('express').Router();
const controller = require('./userController');
const auth = require('../../middleware/auth');
const { adminOnly } = require('../../middleware/rbac');

router.use(auth);

router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.post('/', adminOnly, controller.create);
router.put('/:id', adminOnly, controller.update);
router.delete('/:id', adminOnly, controller.remove);

module.exports = router;
