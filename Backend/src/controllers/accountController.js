const accountService = require('../services/accountService');
const { success, created, error } = require('../utils/responseHelper');

const getAll = async (req, res, next) => {
  try { return success(res, await accountService.listAccounts(req.query.branch_id), 'Accounts retrieved'); }
  catch (err) { next(err); }
};
const getOne = async (req, res, next) => {
  try {
    const item = await accountService.getAccount(req.params.id);
    if (!item) return error(res, 'Account not found', 404);
    return success(res, item, 'Account retrieved');
  } catch (err) { next(err); }
};
const create = async (req, res, next) => {
  try { return created(res, await accountService.createAccount(req.body), 'Account created'); }
  catch (err) { next(err); }
};
const update = async (req, res, next) => {
  try {
    const item = await accountService.updateAccount(req.params.id, req.body);
    if (!item) return error(res, 'Account not found', 404);
    return success(res, item, 'Account updated');
  } catch (err) { next(err); }
};
const remove = async (req, res, next) => {
  try {
    if (!await accountService.deleteAccount(req.params.id)) return error(res, 'Account not found', 404);
    return success(res, null, 'Account deleted');
  } catch (err) { next(err); }
};
const getBranchConfigs = async (req, res, next) => {
  try { return success(res, await accountService.getBranchConfigs(req.params.id), 'Branch configs retrieved'); }
  catch (err) { next(err); }
};

module.exports = { getAll, getOne, create, update, remove, getBranchConfigs };
