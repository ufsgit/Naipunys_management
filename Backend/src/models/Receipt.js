const { callProcedure } = require('../config/db');

module.exports = {
  getAll: (branchId, limit, offset) =>
    callProcedure('sp_GetReceipts', [branchId, limit, offset]),

  getById: (id) =>
    callProcedure('sp_GetReceiptById', [id]),

  create: (data) =>
    callProcedure('sp_CreateReceipt', [
      data.receipt_no, data.receipt_date, data.received_from, data.student_id,
      data.course, data.branch_id, data.amount, data.voucher_no, data.details,
      data.to_account_id, data.payment_mode, data.reference_no, data.remark
    ]),

  remove: (id) =>
    callProcedure('sp_DeleteReceipt', [id])
};
