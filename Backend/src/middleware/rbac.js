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
    const roleUpper = (req.user.role_name || '').toUpperCase();
    const isAllowed = allowedRoles.some(r => String(r).toUpperCase() === roleUpper) ||
      (allowedRoles.some(r => String(r).toUpperCase() === 'ADMIN') &&
        (roleUpper === 'ADMINISTRATIOR' || roleUpper === 'ADMINISTRATOR' || req.user.role_id === 1));
    if (!isAllowed) {
      return error(res, 'Forbidden: insufficient permissions', 403);
    }
    next();
  };
};

/**
 * Admin-only shortcut
 */
const adminOnly = (req, res, next) => {
  if (!req.user) {
    return error(res, 'Unauthorized', 401);
  }
  const role = (req.user.role_name || '').toUpperCase();
  if (role === 'ADMIN' || role === 'ADMINISTRATIOR' || role === 'ADMINISTRATOR' || req.user.role_id === 1) {
    return next();
  }
  return error(res, 'Forbidden: insufficient permissions', 403);
};

module.exports = { rbac, adminOnly };
