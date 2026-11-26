const Receipt = require('./Receipt');
const { getPagination, buildPaginationMeta } = require('../../utils/pagination');

const listReceipts = async (query) => {
  const { page, limit, offset } = getPagination(query);
  const branchId = query.branch_id || null;
  const rows = await Receipt.getAll(branchId, limit, offset);
  return { rows, pagination: buildPaginationMeta(page, limit, rows.length) };
};

const getReceipt = async (id) => {
  const rows = await Receipt.getById(id);
  return rows[0] || null;
};

const createReceipt = async (data) => {
  const result = await Receipt.create(data);
  return getReceipt(result[0]?.id);
};

const updateReceipt = async (id, data) => {
  await Receipt.update(id, data);
  return getReceipt(id);
};

const deleteReceipt = async (id) => {
  const result = await Receipt.remove(id);
  return result[0]?.affected > 0;
};

module.exports = { listReceipts, getReceipt, createReceipt, updateReceipt, deleteReceipt };
