const { callProcedure } = require('../../config/db');

module.exports = {
  getByType: (type) =>
    callProcedure('GetSettingsByType', [type]),

  create: (data) =>
    callProcedure('CreateSetting', [data.type, data.code, data.name, data.sort_order]),

  update: (id, data) =>
    callProcedure('UpdateSetting', [id, data.name, data.sort_order, data.status]),

  remove: (id) =>
    callProcedure('DeleteSetting', [id])
};
