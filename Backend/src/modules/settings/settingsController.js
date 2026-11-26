const settingsService = require('./settingsService');
const { success, created, error } = require('../../utils/responseHelper');
const { SETTING_TYPES } = require('../../config/constants');

const getByType = async (req, res, next) => {
  try {
    if (!SETTING_TYPES.includes(req.params.type)) {
      return error(res, 'Invalid settings type', 400);
    }
    return success(res, await settingsService.getSettings(req.params.type), 'Settings retrieved');
  } catch (err) { next(err); }
};
const create = async (req, res, next) => {
  try {
    const data = { ...req.body, type: req.params.type };
    return created(res, await settingsService.createSetting(data), 'Setting created');
  } catch (err) { next(err); }
};
const update = async (req, res, next) => {
  try {
    if (!await settingsService.updateSetting(req.params.id, req.body)) return error(res, 'Setting not found', 404);
    return success(res, null, 'Setting updated');
  } catch (err) { next(err); }
};
const remove = async (req, res, next) => {
  try {
    if (!await settingsService.deleteSetting(req.params.id)) return error(res, 'Setting not found', 404);
    return success(res, null, 'Setting deleted');
  } catch (err) { next(err); }
};

module.exports = { getByType, create, update, remove };
