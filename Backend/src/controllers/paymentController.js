const paymentService = require('../services/paymentService');
const { success, created, error } = require('../utils/responseHelper');

const getAll = async (req, res, next) => {
  try {
    const result = await paymentService.listPayments(req.query);
    return success(res, result.rows, 'Payments retrieved');
  } catch (err) { next(err); }
};
const getOne = async (req, res, next) => {
  try {
    const item = await paymentService.getPayment(req.params.id);
    if (!item) return error(res, 'Payment not found', 404);
    return success(res, item, 'Payment retrieved');
  } catch (err) { next(err); }
};
const create = async (req, res, next) => {
  try { return created(res, await paymentService.createPayment(req.body), 'Payment created'); }
  catch (err) { next(err); }
};
const update = async (req, res, next) => {
  try {
    const item = await paymentService.updatePayment(req.params.id, req.body);
    if (!item) return error(res, 'Payment not found', 404);
    return success(res, item, 'Payment updated');
  } catch (err) { next(err); }
};
const remove = async (req, res, next) => {
  try {
    if (!await paymentService.deletePayment(req.params.id)) return error(res, 'Payment not found', 404);
    return success(res, null, 'Payment deleted');
  } catch (err) { next(err); }
};

module.exports = { getAll, getOne, create, update, remove };
