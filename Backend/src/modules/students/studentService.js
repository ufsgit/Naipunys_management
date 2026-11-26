const Student = require('./Student');
const { getPagination, buildPaginationMeta } = require('../../utils/pagination');

const listStudents = async (query) => {
  const { page, limit, offset } = getPagination(query);
  const branchId = query.branch_id || null;
  const status = query.status || null;
  const students = await Student.getAll(branchId, status, limit, offset);
  return {
    rows: students,
    pagination: buildPaginationMeta(page, limit, students.length)
  };
};

const getStudent = async (id) => {
  const rows = await Student.getById(id);
  return rows[0] || null;
};

const createStudent = async (data) => {
  const result = await Student.create(data);
  const newId = result[0]?.id;
  return getStudent(newId);
};

const updateStudent = async (id, data) => {
  await Student.update(id, data);
  return getStudent(id);
};

const deleteStudent = async (id) => {
  const result = await Student.remove(id);
  return result[0]?.affected > 0;
};

module.exports = {
  listStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent
};
