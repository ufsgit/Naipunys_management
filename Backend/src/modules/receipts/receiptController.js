const receiptService = require('./receiptService');
const { success, created, error } = require('../../utils/responseHelper');

const getAll = async (req, res, next) => {
  try {
    const result = await receiptService.listReceipts(req.query);
    return success(res, result.rows, 'Receipts retrieved');
  } catch (err) { next(err); }
};
const getOne = async (req, res, next) => {
  try {
    const item = await receiptService.getReceipt(req.params.id);
    if (!item) return error(res, 'Receipt not found', 404);
    return success(res, item, 'Receipt retrieved');
  } catch (err) { next(err); }
};
const create = async (req, res, next) => {
  try { return created(res, await receiptService.createReceipt(req.body), 'Receipt created'); }
  catch (err) { next(err); }
};
const update = async (req, res, next) => {
  try {
    const item = await receiptService.updateReceipt(req.params.id, req.body);
    if (!item) return error(res, 'Receipt not found', 404);
    return success(res, item, 'Receipt updated');
  } catch (err) { next(err); }
};
const remove = async (req, res, next) => {
  try {
    if (!await receiptService.deleteReceipt(req.params.id)) return error(res, 'Receipt not found', 404);
    return success(res, null, 'Receipt deleted');
  } catch (err) { next(err); }
};

module.exports = { getAll, getOne, create, update, remove };
