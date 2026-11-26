const { callProcedure } = require('../../config/db');

module.exports = {
  getAll: () =>
    callProcedure('GetCourses'),

  getById: (id) =>
    callProcedure('GetCourseById', [id]),

  create: (data) =>
    callProcedure('CreateCourse', [
      data.code, data.name, data.department_id, data.duration, data.fee
    ]),

  update: (id, data) =>
    callProcedure('UpdateCourse', [
      id, data.code, data.name, data.department_id, data.duration, data.fee, data.status
    ]),

  remove: (id) =>
    callProcedure('DeleteCourse', [id])
};
