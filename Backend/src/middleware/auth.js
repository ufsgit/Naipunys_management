const { verify } = require('../utils/jwtHelper');
const { error } = require('../utils/responseHelper');

/**
 * Verify JWT from Authorization header.
 * Attaches decoded user payload to req.user.
 */
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return error(res, 'Access token required', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    req.user = verify(token);
    next();
  } catch (err) {
    return error(res, 'Invalid or expired token', 401);
  }
};

module.exports = auth;
