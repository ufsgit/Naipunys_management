const Course = require('../models/Course');

const listCourses = async () => Course.getAll();
const getCourse = async (id) => {
  const rows = await Course.getById(id);
  return rows[0] || null;
};
const createCourse = async (data) => {
  const result = await Course.create(data);
  return getCourse(result[0]?.id);
};
const updateCourse = async (id, data) => {
  await Course.update(id, data);
  return getCourse(id);
};
const deleteCourse = async (id) => {
  const result = await Course.remove(id);
  return result[0]?.affected > 0;
};

module.exports = { listCourses, getCourse, createCourse, updateCourse, deleteCourse };
