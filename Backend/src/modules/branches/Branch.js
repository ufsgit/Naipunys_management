const { callProcedure } = require('../../config/db');

module.exports = {
  getAll: () =>
    callProcedure('GetBranches'),

  getById: (id) =>
    callProcedure('GetBranchById', [id]),

  create: (data) =>
    callProcedure('CreateBranch', [
      data.code, data.name, data.city, data.phone, data.address
    ]),

  update: (id, data) =>
    callProcedure('UpdateBranch', [
      id, data.code, data.name, data.city, data.phone, data.address, data.status
    ]),

  remove: (id) =>
    callProcedure('DeleteBranch', [id])
};
