const { callProcedure } = require('../config/db');

module.exports = {
  getAll: () =>
    callProcedure('sp_GetCourses'),

  getById: (id) =>
    callProcedure('sp_GetCourseById', [id]),

  create: (data) =>
    callProcedure('sp_CreateCourse', [
      data.code, data.name, data.department_id, data.duration, data.fee
    ]),

  update: (id, data) =>
    callProcedure('sp_UpdateCourse', [
      id, data.code, data.name, data.department_id, data.duration, data.fee, data.status
    ]),

  remove: (id) =>
    callProcedure('sp_DeleteCourse', [id])
};
