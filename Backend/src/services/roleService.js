const Role = require('../models/Role');

const listRoles = async () => Role.getAll();
const createRole = async (data) => {
  const result = await Role.create(data);
  return { id: result[0]?.id, ...data };
};
const updateRole = async (id, data) => {
  const result = await Role.update(id, data);
  return result[0]?.affected > 0;
};
const deleteRole = async (id) => {
  const result = await Role.remove(id);
  return result[0]?.affected > 0;
};

module.exports = { listRoles, createRole, updateRole, deleteRole };
