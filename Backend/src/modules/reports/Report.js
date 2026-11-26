const { callProcedure } = require('../../config/db');

module.exports = {
  getFeePending: (branchId) =>
    callProcedure('GetFeePendingReport', [branchId]),

  getFeeReceipt: (fromDate, toDate) =>
    callProcedure('GetFeeReceiptReport', [fromDate, toDate])
};
