const router = require('express').Router();
const controller = require('./settingsController');
const auth = require('../../middleware/auth');
const { adminOnly } = require('../../middleware/rbac');

router.use(auth);

router.get('/:type', controller.getByType);
router.post('/:type', adminOnly, controller.create);
router.put('/:id', adminOnly, controller.update);
router.delete('/:id', adminOnly, controller.remove);

module.exports = router;
