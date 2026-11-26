const { callProcedure } = require('../../config/db');

module.exports = {
  getDepartmentPermissions: () =>
    callProcedure('GetDepartmentPermissions'),

  getMenuPermissions: () =>
    callProcedure('GetMenuPermissions')
};
