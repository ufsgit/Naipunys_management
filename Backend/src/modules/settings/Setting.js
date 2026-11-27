const { pool, callProcedure } = require('../../config/db');

module.exports = {
  getByType: (type) =>
    callProcedure('GetSettingsByType', [type]),

  create: (data) =>
    callProcedure('CreateSetting', [data.type, data.code, data.name, data.sort_order]),

  update: (id, data) =>
    callProcedure('UpdateSetting', [id, data.name, data.sort_order, data.status]),

  remove: async (id) => {
    try {
      await pool.query('UPDATE follow_ups SET followup_type_id = NULL WHERE followup_type_id = ?', [id]);
      const [res] = await pool.query('DELETE FROM settings WHERE id = ?', [id]);
      return [{ affected: res.affectedRows }];
    } catch (err) {
      console.warn('[Setting.remove] fallback:', err.message);
      return callProcedure('DeleteSetting', [id]);
    }
  }
};
