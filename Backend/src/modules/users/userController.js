const userService = require('./userService');
const { success, created, error } = require('../../utils/responseHelper');

const getAll = async (req, res, next) => {
  try { return success(res, await userService.listUsers(), 'Users retrieved'); }
  catch (err) { next(err); }
};
const getOne = async (req, res, next) => {
  try {
    const item = await userService.getUser(req.params.id);
    if (!item) return error(res, 'User not found', 404);
    return success(res, item, 'User retrieved');
  } catch (err) { next(err); }
};
const create = async (req, res, next) => {
  try { return created(res, await userService.createUser(req.body), 'User created'); }
  catch (err) { next(err); }
};
const update = async (req, res, next) => {
  try {
    const item = await userService.updateUser(req.params.id, req.body);
    if (!item) return error(res, 'User not found', 404);
    return success(res, item, 'User updated');
  } catch (err) { next(err); }
};
const remove = async (req, res, next) => {
  try {
    if (!await userService.deleteUser(req.params.id)) return error(res, 'User not found', 404);
    return success(res, null, 'User deleted');
  } catch (err) { next(err); }
};

module.exports = { getAll, getOne, create, update, remove };
