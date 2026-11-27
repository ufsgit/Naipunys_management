const { pool, callProcedure } = require('../../config/db');

module.exports = {
  getAll: async (branchId, status, limit = 100, offset = 0) => {
    try {
      const query = `
        SELECT s.*, 
               c.name AS course_name, 
               b.name AS branch_name, 
               d.name AS department_name,
               (SELECT f.next_followup_date FROM follow_ups f WHERE f.student_id = s.id ORDER BY f.id DESC LIMIT 1) AS next_followup_date,
               (SELECT f.remarks FROM follow_ups f WHERE f.student_id = s.id ORDER BY f.id DESC LIMIT 1) AS latest_followup_remark,
               (SELECT f.status FROM follow_ups f WHERE f.student_id = s.id ORDER BY f.id DESC LIMIT 1) AS latest_followup_status,
               (SELECT u.username FROM follow_ups f LEFT JOIN users u ON f.assigned_to_id = u.id WHERE f.student_id = s.id ORDER BY f.id DESC LIMIT 1) AS assigned_to_name
        FROM students s
        LEFT JOIN courses c ON s.course_id = c.id
        LEFT JOIN branches b ON s.branch_id = b.id
        LEFT JOIN departments d ON s.department_id = d.id
        WHERE (? IS NULL OR s.branch_id = ?)
          AND (? IS NULL OR s.status = ?)
        ORDER BY s.created_at DESC
        LIMIT ? OFFSET ?
      `;
      const [rows] = await pool.query(query, [
        branchId || null, branchId || null,
        status || null, status || null,
        Number(limit) || 100, Number(offset) || 0
      ]);
      return rows;
    } catch (e) {
      return callProcedure('GetStudents', [branchId, status, limit, offset]);
    }
  },

  getById: async (id) => {
    try {
      const query = `
        SELECT s.*, 
               c.name AS course_name, 
               b.name AS branch_name, 
               d.name AS department_name,
               (SELECT f.next_followup_date FROM follow_ups f WHERE f.student_id = s.id ORDER BY f.id DESC LIMIT 1) AS next_followup_date,
               (SELECT f.remarks FROM follow_ups f WHERE f.student_id = s.id ORDER BY f.id DESC LIMIT 1) AS latest_followup_remark,
               (SELECT f.status FROM follow_ups f WHERE f.student_id = s.id ORDER BY f.id DESC LIMIT 1) AS latest_followup_status,
               (SELECT u.username FROM follow_ups f LEFT JOIN users u ON f.assigned_to_id = u.id WHERE f.student_id = s.id ORDER BY f.id DESC LIMIT 1) AS assigned_to_name
        FROM students s
        LEFT JOIN courses c ON s.course_id = c.id
        LEFT JOIN branches b ON s.branch_id = b.id
        LEFT JOIN departments d ON s.department_id = d.id
        WHERE s.id = ?
      `;
      const [rows] = await pool.query(query, [id]);
      return rows;
    } catch (e) {
      return callProcedure('GetStudentById', [id]);
    }
  },

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

