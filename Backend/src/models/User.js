const { callProcedure } = require('../config/db');

module.exports = {
  getAll: () =>
    callProcedure('sp_GetUsers'),

  getById: (id) =>
    callProcedure('sp_GetUserById', [id]),

  findByUsername: (username) =>
    callProcedure('sp_LoginUser', [username]),

  create: (data) =>
    callProcedure('sp_CreateUser', [
      data.username, data.full_name, data.email, data.phone,
      data.role_id, data.branch_id, data.password_hash
    ]),

  update: (id, data) =>
    callProcedure('sp_UpdateUser', [
      id, data.username, data.full_name, data.email, data.phone,
      data.role_id, data.branch_id, data.status
    ]),

  remove: (id) =>
    callProcedure('sp_DeleteUser', [id])
};
