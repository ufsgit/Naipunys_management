const { callProcedure } = require('../config/db');

module.exports = {
  getAll: () =>
    callProcedure('sp_GetDepartments'),

  getById: (id) =>
    callProcedure('sp_GetDepartmentById', [id]),

  create: (data) =>
    callProcedure('sp_CreateDepartment', [
      data.code, data.name, data.head_of_department_id
    ]),

  update: (id, data) =>
    callProcedure('sp_UpdateDepartment', [
      id, data.code, data.name, data.head_of_department_id, data.status
    ]),

  remove: (id) =>
    callProcedure('sp_DeleteDepartment', [id])
};
