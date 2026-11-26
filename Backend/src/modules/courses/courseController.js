const courseService = require('./courseService');
const { success, created, error } = require('../../utils/responseHelper');

const getAll = async (req, res, next) => {
  try {
    return success(res, await courseService.listCourses(), 'Courses retrieved');
  } catch (err) { next(err); }
};
const getOne = async (req, res, next) => {
  try {
    const item = await courseService.getCourse(req.params.id);
    if (!item) return error(res, 'Course not found', 404);
    return success(res, item, 'Course retrieved');
  } catch (err) { next(err); }
};
const create = async (req, res, next) => {
  try {
    return created(res, await courseService.createCourse(req.body), 'Course created');
  } catch (err) { next(err); }
};
const update = async (req, res, next) => {
  try {
    const item = await courseService.updateCourse(req.params.id, req.body);
    if (!item) return error(res, 'Course not found', 404);
    return success(res, item, 'Course updated');
  } catch (err) { next(err); }
};
const remove = async (req, res, next) => {
  try {
    if (!await courseService.deleteCourse(req.params.id)) return error(res, 'Course not found', 404);
    return success(res, null, 'Course deleted');
  } catch (err) { next(err); }
};

module.exports = { getAll, getOne, create, update, remove };
