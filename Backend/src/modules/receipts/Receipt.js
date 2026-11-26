const { callProcedure } = require('../../config/db');

module.exports = {
  getAll: (branchId, limit, offset) =>
    callProcedure('GetReceipts', [branchId, limit, offset]),

  getById: (id) =>
    callProcedure('GetReceiptById', [id]),

  create: (data) =>
    callProcedure('CreateReceipt', [
      data.receipt_no, data.receipt_date, data.received_from, data.student_id,
      data.course, data.branch_id, data.amount, data.voucher_no, data.details,
      data.to_account_id, data.payment_mode, data.reference_no, data.remark
    ]),

  update: (id, data) =>
    callProcedure('UpdateReceipt', [
      id, data.receipt_date || null, data.received_from || '', data.student_id || null,
      data.course || '', data.branch_id || null, data.amount || 0,
      data.voucher_no || '', data.details || '', data.to_account_id || null
    ]),

  remove: (id) =>
    callProcedure('DeleteReceipt', [id])
};
