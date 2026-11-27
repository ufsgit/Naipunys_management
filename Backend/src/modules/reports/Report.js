const { pool, callProcedure } = require('../../config/db');

module.exports = {
  getFeePending: async (branchId) => {
    try {
      const [rows] = await pool.query(`
        SELECT s.id, s.name, s.phone, s.branch_id, b.name AS branch_name, s.status,
          GREATEST(0, s.fees_total - COALESCE(
            (SELECT SUM(r.amount) FROM receipts r WHERE r.student_id = s.id OR (r.student_id IS NULL AND LOWER(r.received_from) = LOWER(s.name))),
            s.fees_paid,
            0
          )) AS balance_amount
        FROM students s
        LEFT JOIN branches b ON s.branch_id = b.id
        WHERE (? IS NULL OR s.branch_id = ?)
        HAVING balance_amount > 0
        ORDER BY s.name
      `, [branchId || null, branchId || null]);
      return rows;
    } catch (e) {
      return callProcedure('GetFeePendingReport', [branchId]);
    }
  },

  getFeeReceipt: (fromDate, toDate) =>
    callProcedure('GetFeeReceiptReport', [fromDate, toDate]),

  getBranchAccountReport: async (fromDate, toDate, branchId) => {
    let sql = `
      SELECT
        p.payment_date AS date,
        p.paid_to AS details,
        p.voucher_no AS voucherNumber,
        p.amount AS payment,
        0.00 AS receipt,
        COALESCE(p.remarks, p.category, '') AS description,
        p.branch_id,
        b.name AS branch_name
      FROM payments p
      LEFT JOIN branches b ON p.branch_id = b.id
      WHERE 1=1
    `;
    const params1 = [];
    if (fromDate) {
      sql += ` AND p.payment_date >= ?`;
      params1.push(fromDate);
    }
    if (toDate) {
      sql += ` AND p.payment_date <= ?`;
      params1.push(toDate);
    }
    if (branchId) {
      sql += ` AND p.branch_id = ?`;
      params1.push(branchId);
    }

    sql += `
      UNION ALL
      SELECT
        r.receipt_date AS date,
        COALESCE(s.name, r.received_from, 'Student Fee') AS details,
        COALESCE(r.voucher_no, r.receipt_no, '') AS voucherNumber,
        0.00 AS payment,
        r.amount AS receipt,
        COALESCE(r.details, r.remark, '') AS description,
        r.branch_id,
        b.name AS branch_name
      FROM receipts r
      LEFT JOIN students s ON r.student_id = s.id
      LEFT JOIN branches b ON r.branch_id = b.id
      WHERE 1=1
    `;
    const params2 = [];
    if (fromDate) {
      sql += ` AND r.receipt_date >= ?`;
      params2.push(fromDate);
    }
    if (toDate) {
      sql += ` AND r.receipt_date <= ?`;
      params2.push(toDate);
    }
    if (branchId) {
      sql += ` AND r.branch_id = ?`;
      params2.push(branchId);
    }

    sql += ` ORDER BY date DESC, voucherNumber DESC`;

    const [rows] = await pool.query(sql, [...params1, ...params2]);
    return rows;
  }
};
