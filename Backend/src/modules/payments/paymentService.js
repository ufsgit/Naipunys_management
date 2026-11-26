const Payment = require('./Payment');
const { getPagination, buildPaginationMeta } = require('../../utils/pagination');

const listPayments = async (query) => {
  const { page, limit, offset } = getPagination(query);
  const branchId = query.branch_id || null;
  const rows = await Payment.getAll(branchId, limit, offset);
  return { rows, pagination: buildPaginationMeta(page, limit, rows.length) };
};

const getPayment = async (id) => {
  const rows = await Payment.getById(id);
  return rows[0] || null;
};

const createPayment = async (data) => {
  const result = await Payment.create(data);
  return getPayment(result[0]?.id);
};

const updatePayment = async (id, data) => {
  await Payment.update(id, data);
  return getPayment(id);
};

const deletePayment = async (id) => {
  const result = await Payment.remove(id);
  return result[0]?.affected > 0;
};

module.exports = {
  listPayments,
  getPayment,
  createPayment,
  updatePayment,
  deletePayment
};
