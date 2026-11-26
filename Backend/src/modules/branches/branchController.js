const branchService = require('./branchService');
const { success, created, error } = require('../../utils/responseHelper');

const getAll = async (req, res, next) => {
  try { return success(res, await branchService.listBranches(), 'Branches retrieved'); }
  catch (err) { next(err); }
};
const getOne = async (req, res, next) => {
  try {
    const item = await branchService.getBranch(req.params.id);
    if (!item) return error(res, 'Branch not found', 404);
    return success(res, item, 'Branch retrieved');
  } catch (err) { next(err); }
};
const create = async (req, res, next) => {
  try { return created(res, await branchService.createBranch(req.body), 'Branch created'); }
  catch (err) { next(err); }
};
const update = async (req, res, next) => {
  try {
    const item = await branchService.updateBranch(req.params.id, req.body);
    if (!item) return error(res, 'Branch not found', 404);
    return success(res, item, 'Branch updated');
  } catch (err) { next(err); }
};
const remove = async (req, res, next) => {
  try {
    if (!await branchService.deleteBranch(req.params.id)) return error(res, 'Branch not found', 404);
    return success(res, null, 'Branch deleted');
  } catch (err) { next(err); }
};

module.exports = { getAll, getOne, create, update, remove };
