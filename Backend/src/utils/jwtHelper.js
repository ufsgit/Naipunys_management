const jwt = require('jsonwebtoken');
const { env } = require('../config/db');

const sign = (payload) => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
};

const verify = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};

module.exports = { sign, verify };
