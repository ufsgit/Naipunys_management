const Permission = require('./Permission');

const listDepartmentPermissions = async () => Permission.getDepartmentPermissions();
const listMenuPermissions = async () => Permission.getMenuPermissions();

module.exports = { listDepartmentPermissions, listMenuPermissions };
