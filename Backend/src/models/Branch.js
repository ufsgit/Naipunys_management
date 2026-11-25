const { callProcedure } = require('../config/db');

module.exports = {
  getAll: () =>
    callProcedure('sp_GetBranches'),

  getById: (id) =>
    callProcedure('sp_GetBranchById', [id]),

  create: (data) =>
    callProcedure('sp_CreateBranch', [
      data.code, data.name, data.city, data.phone, data.address
    ]),

  update: (id, data) =>
    callProcedure('sp_UpdateBranch', [
      id, data.code, data.name, data.city, data.phone, data.address, data.status
    ]),

  remove: (id) =>
    callProcedure('sp_DeleteBranch', [id])
};
