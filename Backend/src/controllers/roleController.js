const roleService = require('../services/roleService');
const { success, created, error } = require('../utils/responseHelper');

const getAll = async (req, res, next) => {
  try { return success(res, await roleService.listRoles(), 'Roles retrieved'); }
  catch (err) { next(err); }
};
const create = async (req, res, next) => {
  try { return created(res, await roleService.createRole(req.body), 'Role created'); }
  catch (err) { next(err); }
};
const update = async (req, res, next) => {
  try {
    if (!await roleService.updateRole(req.params.id, req.body)) return error(res, 'Role not found', 404);
    return success(res, null, 'Role updated');
  } catch (err) { next(err); }
};
const remove = async (req, res, next) => {
  try {
    if (!await roleService.deleteRole(req.params.id)) return error(res, 'Role not found', 404);
    return success(res, null, 'Role deleted');
  } catch (err) { next(err); }
};

module.exports = { getAll, create, update, remove };
