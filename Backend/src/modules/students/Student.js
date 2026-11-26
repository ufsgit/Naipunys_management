const { callProcedure } = require('../../config/db');

module.exports = {
  getAll: (branchId, status, limit, offset) =>
    callProcedure('GetStudents', [branchId, status, limit, offset]),

  getById: (id) =>
    callProcedure('GetStudentById', [id]),

  create: (data) =>
    callProcedure('CreateStudent', [
      data.student_code, data.name, data.phone, data.email,
      data.parents_mobile, data.whatsapp, data.address, data.facebook,
      data.alt_email, data.enquiry_source, data.enquiry_type, data.course_id,
      data.branch_id, data.department_id, data.batch, data.admission_date,
      data.fees_total, data.fees_paid, data.status
    ]),

  update: (id, data) =>
    callProcedure('UpdateStudent', [
      id, data.name, data.phone, data.email, data.course_id, data.branch_id,
      data.department_id, data.fees_total, data.fees_paid, data.status
    ]),

  remove: (id) =>
    callProcedure('DeleteStudent', [id])
};
