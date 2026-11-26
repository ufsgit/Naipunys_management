const { callProcedure } = require('../../config/db');

module.exports = {
  getAll: () =>
    callProcedure('GetRoles'),

  create: (data) =>
    callProcedure('CreateRole', [data.name, data.role_under || data.under || data.description || '']),

  update: (id, data) =>
    callProcedure('UpdateRole', [id, data.name, data.role_under || data.under || data.description || '', data.status || 'Active']),

  remove: (id) =>
    callProcedure('DeleteRole', [id])
};
