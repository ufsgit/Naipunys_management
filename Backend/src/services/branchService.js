const Branch = require('../models/Branch');

const listBranches = async () => Branch.getAll();
const getBranch = async (id) => {
  const rows = await Branch.getById(id);
  return rows[0] || null;
};
const createBranch = async (data) => {
  const result = await Branch.create(data);
  return getBranch(result[0]?.id);
};
const updateBranch = async (id, data) => {
  await Branch.update(id, data);
  return getBranch(id);
};
const deleteBranch = async (id) => {
  const result = await Branch.remove(id);
  return result[0]?.affected > 0;
};

module.exports = { listBranches, getBranch, createBranch, updateBranch, deleteBranch };
