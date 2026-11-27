const router = require('express').Router();
const controller = require('./settingsController');
const auth = require('../../middleware/auth');

router.use(auth);

router.get('/:type', controller.getByType);
router.post('/:type', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
