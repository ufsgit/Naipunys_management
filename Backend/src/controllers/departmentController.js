const departmentService = require('../services/departmentService');
const { success, created, error } = require('../utils/responseHelper');

const getAll = async (req, res, next) => {
  try { return success(res, await departmentService.listDepartments(), 'Departments retrieved'); }
  catch (err) { next(err); }
};
const getOne = async (req, res, next) => {
  try {
    const item = await departmentService.getDepartment(req.params.id);
    if (!item) return error(res, 'Department not found', 404);
    return success(res, item, 'Department retrieved');
  } catch (err) { next(err); }
};
const create = async (req, res, next) => {
  try { return created(res, await departmentService.createDepartment(req.body), 'Department created'); }
  catch (err) { next(err); }
};
const update = async (req, res, next) => {
  try {
    const item = await departmentService.updateDepartment(req.params.id, req.body);
    if (!item) return error(res, 'Department not found', 404);
    return success(res, item, 'Department updated');
  } catch (err) { next(err); }
};
const remove = async (req, res, next) => {
  try {
    if (!await departmentService.deleteDepartment(req.params.id)) return error(res, 'Department not found', 404);
    return success(res, null, 'Department deleted');
  } catch (err) { next(err); }
};

module.exports = { getAll, getOne, create, update, remove };
