const Setting = require('./Setting');

const getSettings = async (type) => Setting.getByType(type);
const createSetting = async (data) => {
  const result = await Setting.create(data);
  return { id: result[0]?.id, ...data };
};
const updateSetting = async (id, data) => {
  const result = await Setting.update(id, data);
  return result[0]?.affected > 0;
};
const deleteSetting = async (id) => {
  const result = await Setting.remove(id);
  return result[0]?.affected > 0;
};

module.exports = { getSettings, createSetting, updateSetting, deleteSetting };
