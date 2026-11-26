const { callProcedure } = require('../../config/db');

module.exports = {
  getAll: (branchId) =>
    callProcedure('GetAccounts', [branchId]),

  getById: (id) =>
    callProcedure('GetAccountById', [id]),

  create: (data) =>
    callProcedure('CreateAccount', [
      data.account_code, data.name, data.type, data.branch_id,
      data.opening_balance, data.current_balance
    ]),

  update: (id, data) =>
    callProcedure('UpdateAccount', [
      id, data.account_code, data.name, data.type, data.branch_id,
      data.opening_balance, data.current_balance, data.status
    ]),

  remove: (id) =>
    callProcedure('DeleteAccount', [id]),

  getBranchConfigs: (accountId) =>
    callProcedure('GetAccountBranchConfigs', [accountId])
};
