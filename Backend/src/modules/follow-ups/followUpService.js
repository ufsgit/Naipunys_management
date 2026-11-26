const FollowUp = require('./FollowUp');

const listFollowUps = async (studentId, status) =>
  FollowUp.getAll(studentId || null, status || null);

const getFollowUp = async (id) => {
  const rows = await FollowUp.getById(id);
  return rows[0] || null;
};

const createFollowUp = async (data) => {
  const result = await FollowUp.create(data);
  return getFollowUp(result[0]?.id);
};

const updateFollowUp = async (id, data) => {
  await FollowUp.update(id, data);
  return getFollowUp(id);
};

const deleteFollowUp = async (id) => {
  const result = await FollowUp.remove(id);
  return result[0]?.affected > 0;
};

module.exports = {
  listFollowUps,
  getFollowUp,
  createFollowUp,
  updateFollowUp,
  deleteFollowUp
};
