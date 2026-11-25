const reportService = require('../services/reportService');
const { success, error } = require('../utils/responseHelper');

const getFeePending = async (req, res, next) => {
  try {
    return success(res, await reportService.getFeePending(req.query.branch_id), 'Fee pending report');
  } catch (err) { next(err); }
};

const getFeeReceipt = async (req, res, next) => {
  try {
    const { from, to } = req.query;
    if (!from || !to) return error(res, 'from and to dates are required', 400);
    return success(res, await reportService.getFeeReceipt(from, to), 'Fee receipt report');
  } catch (err) { next(err); }
};

module.exports = { getFeePending, getFeeReceipt };
