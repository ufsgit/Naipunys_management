const authService = require('./authService');
const { success, error } = require('../../utils/responseHelper');

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const result = await authService.login(username, password);

    if (!result.valid) {
      return error(res, 'Invalid username or password', 401);
    }

    return success(res, result, 'Login successful');
  } catch (err) {
    next(err);
  }
};

const me = (req, res) => {
  return success(res, req.user, 'Current user');
};

const logout = (req, res) => {
  // JWT is stateless; client discards the token.
  return success(res, null, 'Logged out');
};

module.exports = { login, me, logout };
