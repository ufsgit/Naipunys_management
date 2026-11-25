const { callProcedure } = require('../config/db');

module.exports = {
  getAll: () =>
    callProcedure('sp_GetRoles'),

  create: (data) =>
    callProcedure('sp_CreateRole', [data.name, data.description]),

  update: (id, data) =>
    callProcedure('sp_UpdateRole', [id, data.name, data.description, data.status]),

  remove: (id) =>
    callProcedure('sp_DeleteRole', [id])
};
