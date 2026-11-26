const { callProcedure } = require('../../config/db');

module.exports = {
  getAll: () =>
    callProcedure('GetUsers'),

  getById: (id) =>
    callProcedure('GetUserById', [id]),

  findByUsername: (username, password) =>
    callProcedure('Loginuser', [username, password]),

  create: (data) =>
    callProcedure('CreateUser', [
      data.username, data.full_name, data.email, data.phone,
      data.role_id, data.branch_id, data.password || data.password_hash || 'admin123'
    ]),

  update: (id, data) =>
    callProcedure('UpdateUser', [
      id, data.username, data.full_name, data.email, data.phone,
      data.role_id, data.branch_id, data.status
    ]),

  remove: (id) =>
    callProcedure('DeleteUser', [id])
};
