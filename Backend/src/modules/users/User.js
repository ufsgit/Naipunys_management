const { callProcedure, pool } = require('../../config/db');

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

  update: async (id, data) => {
    const result = await callProcedure('UpdateUser', [
      id, data.username, data.full_name, data.email, data.phone,
      data.role_id, data.branch_id, data.status || 'Active'
    ]);
    if (data.password && String(data.password).trim() && !String(data.password).includes('•')) {
      await pool.query(
        'UPDATE users SET password_hash = SHA2(?, 256) WHERE id = ?',
        [String(data.password).trim(), id]
      );
    }
    return result;
  },

  remove: (id) =>
    callProcedure('DeleteUser', [id])
};
