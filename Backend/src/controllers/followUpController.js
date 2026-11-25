const followUpService = require('../services/followUpService');
const { success, created, error } = require('../utils/responseHelper');

const getAll = async (req, res, next) => {
  try {
    return success(res, await followUpService.listFollowUps(req.query.student_id, req.query.status), 'Follow-ups retrieved');
  } catch (err) { next(err); }
};
const getOne = async (req, res, next) => {
  try {
    const item = await followUpService.getFollowUp(req.params.id);
    if (!item) return error(res, 'Follow-up not found', 404);
    return success(res, item, 'Follow-up retrieved');
  } catch (err) { next(err); }
};
const create = async (req, res, next) => {
  try { return created(res, await followUpService.createFollowUp(req.body), 'Follow-up created'); }
  catch (err) { next(err); }
};
const update = async (req, res, next) => {
  try {
    const item = await followUpService.updateFollowUp(req.params.id, req.body);
    if (!item) return error(res, 'Follow-up not found', 404);
    return success(res, item, 'Follow-up updated');
  } catch (err) { next(err); }
};
const remove = async (req, res, next) => {
  try {
    if (!await followUpService.deleteFollowUp(req.params.id)) return error(res, 'Follow-up not found', 404);
    return success(res, null, 'Follow-up deleted');
  } catch (err) { next(err); }
};

module.exports = { getAll, getOne, create, update, remove };
