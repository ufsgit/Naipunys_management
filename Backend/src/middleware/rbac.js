const { error } = require('../utils/responseHelper');
const { ROLES } = require('../config/constants');

/**
 * Allow only users whose role is in the allowed list.
 * Usage: rbac(ROLES.ADMIN, ROLES.USER)
 */
const rbac = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return error(res, 'Unauthorized', 401);
    }
    if (!allowedRoles.includes(req.user.role_name)) {
      return error(res, 'Forbidden: insufficient permissions', 403);
    }
    next();
  };
};

/**
 * Admin-only shortcut
 */
const adminOnly = rbac(ROLES.ADMIN);

module.exports = { rbac, adminOnly };
