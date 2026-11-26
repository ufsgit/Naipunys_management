const router = require('express').Router();
const controller = require('./permissionController');
const auth = require('../../middleware/auth');

router.use(auth);

router.get('/departments', controller.getDepartments);
router.get('/menus', controller.getMenus);

module.exports = router;
