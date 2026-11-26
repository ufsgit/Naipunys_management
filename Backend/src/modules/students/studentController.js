const studentService = require('./studentService');
const { success, created, error } = require('../../utils/responseHelper');

const getAll = async (req, res, next) => {
  try {
    const result = await studentService.listStudents(req.query);
    return success(res, result.rows, 'Students retrieved', 200);
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const student = await studentService.getStudent(req.params.id);
    if (!student) return error(res, 'Student not found', 404);
    return success(res, student, 'Student retrieved');
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const student = await studentService.createStudent(req.body);
    return created(res, student, 'Student created');
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const student = await studentService.updateStudent(req.params.id, req.body);
    if (!student) return error(res, 'Student not found', 404);
    return success(res, student, 'Student updated');
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const deleted = await studentService.deleteStudent(req.params.id);
    if (!deleted) return error(res, 'Student not found', 404);
    return success(res, null, 'Student deleted');
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getOne, create, update, remove };
