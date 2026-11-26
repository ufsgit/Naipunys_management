const permissionService = require('./permissionService');
const { success } = require('../../utils/responseHelper');

const getDepartments = async (req, res, next) => {
  try { return success(res, await permissionService.listDepartmentPermissions(), 'Department permissions retrieved'); }
  catch (err) { next(err); }
};

const getMenus = async (req, res, next) => {
  try { return success(res, await permissionService.listMenuPermissions(), 'Menu permissions retrieved'); }
  catch (err) { next(err); }
};

module.exports = { getDepartments, getMenus };
