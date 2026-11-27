const { pool, callProcedure } = require('../../config/db');

module.exports = {
  getAll: async (branchId, limit, offset, fromDate, toDate) => {
    let sql = `
      SELECT p.*, a.name AS account_name, b.name AS branch_name
      FROM payments p
      LEFT JOIN accounts a ON p.account_id = a.id
      LEFT JOIN branches b ON p.branch_id = b.id
      WHERE 1=1
    `;
    const params = [];
    if (branchId) {
      sql += ` AND p.branch_id = ?`;
      params.push(branchId);
    }
    if (fromDate) {
      sql += ` AND p.payment_date >= ?`;
      params.push(fromDate);
    }
    if (toDate) {
      sql += ` AND p.payment_date <= ?`;
      params.push(toDate);
    }
    sql += ` ORDER BY p.payment_date DESC, p.id DESC`;
    if (limit) {
      sql += ` LIMIT ? OFFSET ?`;
      params.push(Number(limit) || 1000, Number(offset) || 0);
    }
    const [rows] = await pool.query(sql, params);
    return rows;
  },

  getById: (id) =>
    callProcedure('GetPaymentById', [id]),

  create: (data) =>
    callProcedure('CreatePayment', [
      data.voucher_no, data.payment_date, data.paid_to, data.category || 'General',
      data.account_id || null, data.branch_id || null, data.amount || 0, data.payment_mode || 'Cash', data.remarks || ''
    ]),

  update: (id, data) =>
    callProcedure('UpdatePayment', [
      id, data.voucher_no, data.payment_date, data.paid_to, data.category || 'General',
      data.account_id || null, data.branch_id || null, data.amount || 0, data.payment_mode || 'Cash', data.remarks || ''
    ]),

  remove: (id) =>
    callProcedure('DeletePayment', [id])
};
