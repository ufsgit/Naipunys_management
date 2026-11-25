const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { sign } = require('../utils/jwtHelper');

const login = async (username, password) => {
  const rows = await User.findByUsername(username);
  const user = rows[0];

  if (!user || user.status !== 'Active') {
    return { valid: false };
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
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
