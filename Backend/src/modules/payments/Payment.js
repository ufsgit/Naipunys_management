const { callProcedure } = require('../../config/db');

module.exports = {
  getAll: (branchId, limit, offset) =>
    callProcedure('GetPayments', [branchId, limit, offset]),

  getById: (id) =>
    callProcedure('GetPaymentById', [id]),

  create: (data) =>
    callProcedure('CreatePayment', [
      data.voucher_no, data.payment_date, data.paid_to, data.category,
      data.account_id, data.branch_id, data.amount, data.payment_mode, data.remarks
    ]),

  update: (id, data) =>
    callProcedure('UpdatePayment', [
      id, data.voucher_no, data.payment_date, data.paid_to, data.category,
      data.account_id, data.branch_id, data.amount, data.payment_mode, data.remarks
    ]),

  remove: (id) =>
    callProcedure('DeletePayment', [id])
};
