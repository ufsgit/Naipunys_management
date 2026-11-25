const { callProcedure } = require('../config/db');

module.exports = {
  getByType: (type) =>
    callProcedure('sp_GetSettingsByType', [type]),

  create: (data) =>
    callProcedure('sp_CreateSetting', [data.type, data.code, data.name, data.sort_order]),

  update: (id, data) =>
    callProcedure('sp_UpdateSetting', [id, data.name, data.sort_order, data.status]),

  remove: (id) =>
    callProcedure('sp_DeleteSetting', [id])
};
