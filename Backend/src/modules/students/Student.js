const { pool, callProcedure } = require('../../config/db');

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

  remove: async (id) => {
    try {
      const [students] = await pool.query('SELECT name FROM students WHERE id = ?', [id]);
      const studentName = students[0]?.name;

      await pool.query('DELETE FROM follow_ups WHERE student_id = ?', [id]);
      if (studentName) {
        await pool.query('DELETE FROM follow_ups WHERE student_id IN (SELECT id FROM students WHERE LOWER(name) = LOWER(?))', [studentName]);
      }
      await pool.query('UPDATE receipts SET student_id = NULL WHERE student_id = ?', [id]);
      const [res] = await pool.query('DELETE FROM students WHERE id = ?', [id]);
      return [{ affected: res.affectedRows }];
    } catch (err) {
      console.warn('[Student.remove] direct delete fallback to procedure:', err.message);
      return callProcedure('DeleteStudent', [id]);
    }
  }
};

