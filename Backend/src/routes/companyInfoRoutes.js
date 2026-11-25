const router = require('express').Router();
const controller = require('../controllers/companyInfoController');
const auth = require('../middleware/auth');
const { adminOnly } = require('../middleware/rbac');

router.use(auth);

router.get('/', controller.get);
router.put('/', adminOnly, controller.update);

module.exports = router;
