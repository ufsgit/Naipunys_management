const router = require('express').Router();
const controller = require('../controllers/reportController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/fee-pending', controller.getFeePending);
router.get('/fee-receipt', controller.getFeeReceipt);

module.exports = router;
