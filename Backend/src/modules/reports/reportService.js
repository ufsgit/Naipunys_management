const Report = require('./Report');

const getFeePending = async (branchId) => Report.getFeePending(branchId || null);

const getFeeReceipt = async (fromDate, toDate) => Report.getFeeReceipt(fromDate, toDate);

module.exports = { getFeePending, getFeeReceipt };
