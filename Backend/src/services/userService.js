const User = require('../models/User');

const listUsers = async () => User.getAll();
const getUser = async (id) => {
  const rows = await User.getById(id);
  return rows[0] || null;
};
const createUser = async (data) => {
  const result = await User.create(data);
  return getUser(result[0]?.id);
};
const updateUser = async (id, data) => {
  await User.update(id, data);
  return getUser(id);
};
const deleteUser = async (id) => {
  const result = await User.remove(id);
  return result[0]?.affected > 0;
};

module.exports = { listUsers, getUser, createUser, updateUser, deleteUser };
