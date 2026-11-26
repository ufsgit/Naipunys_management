const User = require('./authModel');
const { sign } = require('../../utils/jwtHelper');

const login = async (username, password) => {
  const rows = await User.findByUsername(username, password);
  const user = Array.isArray(rows) ? rows[0] : rows;

  if (!user || user.status !== 'Active') {
    return { valid: false };
  }

  const token = sign({
    id: user.id,
    username: user.username,
    role_name: user.role_name,
    role_id: user.role_id,
    branch_id: user.branch_id
  });

  return {
    valid: true,
    token,
    user: {
      id: user.id,
      username: user.username,
      role_name: user.role_name,
      branch_id: user.branch_id
    }
  };
};

module.exports = { login };
