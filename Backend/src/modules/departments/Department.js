const { callProcedure } = require('../../config/db');

module.exports = {
  getAll: () =>
    callProcedure('GetDepartments'),

  getById: (id) =>
    callProcedure('GetDepartmentById', [id]),

  create: (data) =>
    callProcedure('CreateDepartment', [
      data.code, data.name, data.head_of_department_id
    ]),

  update: (id, data) =>
    callProcedure('UpdateDepartment', [
      id, data.code, data.name, data.head_of_department_id, data.status
    ]),

  remove: (id) =>
    callProcedure('DeleteDepartment', [id])
};
