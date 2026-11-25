const { callProcedure } = require('../config/db');

module.exports = {
  getAll: (branchId) =>
    callProcedure('sp_GetAccounts', [branchId]),

  getById: (id) =>
    callProcedure('sp_GetAccountById', [id]),

  create: (data) =>
    callProcedure('sp_CreateAccount', [
      data.account_code, data.name, data.type, data.branch_id,
      data.opening_balance, data.current_balance
    ]),

  update: (id, data) =>
    callProcedure('sp_UpdateAccount', [
      id, data.account_code, data.name, data.type, data.branch_id,
      data.opening_balance, data.current_balance, data.status
    ]),

  remove: (id) =>
    callProcedure('sp_DeleteAccount', [id]),

  getBranchConfigs: (accountId) =>
    callProcedure('sp_GetAccountBranchConfigs', [accountId])
};
