const Report = require('./Report');

const getFeePending = async (branchId) => Report.getFeePending(branchId || null);

const getFeeReceipt = async (fromDate, toDate) => Report.getFeeReceipt(fromDate, toDate);

const getBranchAccountReport = async (fromDate, toDate, branchId) =>
  Report.getBranchAccountReport(fromDate, toDate, branchId || null);

module.exports = { getFeePending, getFeeReceipt, getBranchAccountReport };
