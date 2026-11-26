const companyInfoService = require('./companyInfoService');
const { success, error } = require('../../utils/responseHelper');

const get = async (req, res, next) => {
  try {
    const info = await companyInfoService.getCompanyInfo();
    if (!info) return error(res, 'Company info not found', 404);
    return success(res, info, 'Company info retrieved');
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const info = await companyInfoService.updateCompanyInfo(req.body);
    if (!info) return error(res, 'Company info not found', 404);
    return success(res, info, 'Company info updated');
  } catch (err) { next(err); }
};

module.exports = { get, update };
