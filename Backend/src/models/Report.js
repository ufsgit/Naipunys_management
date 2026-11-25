const { callProcedure } = require('../config/db');

module.exports = {
  getFeePending: (branchId) =>
    callProcedure('sp_GetFeePendingReport', [branchId]),

  getFeeReceipt: (fromDate, toDate) =>
    callProcedure('sp_GetFeeReceiptReport', [fromDate, toDate])
};
