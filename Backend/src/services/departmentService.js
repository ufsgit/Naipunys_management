const Department = require('../models/Department');

const listDepartments = async () => Department.getAll();
const getDepartment = async (id) => {
  const rows = await Department.getById(id);
  return rows[0] || null;
};
const createDepartment = async (data) => {
  const result = await Department.create(data);
  return getDepartment(result[0]?.id);
};
const updateDepartment = async (id, data) => {
  await Department.update(id, data);
  return getDepartment(id);
};
const deleteDepartment = async (id) => {
  const result = await Department.remove(id);
  return result[0]?.affected > 0;
};

module.exports = {
  listDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment
};
