const Account = require('../models/Account');

const listAccounts = async (branchId) => Account.getAll(branchId || null);
const getAccount = async (id) => {
  const rows = await Account.getById(id);
  return rows[0] || null;
};
const createAccount = async (data) => {
  const result = await Account.create(data);
  return getAccount(result[0]?.id);
};
const updateAccount = async (id, data) => {
  await Account.update(id, data);
  return getAccount(id);
};
const deleteAccount = async (id) => {
  const result = await Account.remove(id);
  return result[0]?.affected > 0;
};
const getBranchConfigs = async (id) => Account.getBranchConfigs(id);

module.exports = {
  listAccounts,
  getAccount,
  createAccount,
  updateAccount,
  deleteAccount,
  getBranchConfigs
};
