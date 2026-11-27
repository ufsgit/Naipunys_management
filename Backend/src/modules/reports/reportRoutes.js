const router = require('express').Router();
const controller = require('./reportController');
const auth = require('../../middleware/auth');

router.use(auth);

router.get('/fee-pending', controller.getFeePending);
router.get('/fee-receipt', controller.getFeeReceipt);
router.get('/branch-account', controller.getBranchAccountReport);

module.exports = router;
