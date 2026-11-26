const { callProcedure } = require('../../config/db');

module.exports = {
  findByUsername: (username, password) =>
    callProcedure('Loginuser', [username, password])
};
