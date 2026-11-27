const { pool, callProcedure } = require('../../config/db');

module.exports = {
  getAll: async (studentId, status) => {
    try {
      const query = `
        SELECT f.*, s.name AS student_name, s.phone AS student_phone, u.full_name AS assigned_to_name, st.name AS followup_type_name
        FROM follow_ups f
        INNER JOIN students s ON f.student_id = s.id
        LEFT JOIN users u ON f.assigned_to_id = u.id
        LEFT JOIN settings st ON f.followup_type_id = st.id
        WHERE (? IS NULL OR f.student_id = ?)
          AND (? IS NULL OR f.status = ?)
        ORDER BY f.followup_date DESC
      `;
      const [rows] = await pool.query(query, [studentId || null, studentId || null, status || null, status || null]);
      return rows;
    } catch (e) {
      return callProcedure('GetFollowUps', [studentId, status]);
    }
  },

  getById: (id) =>
    callProcedure('GetFollowUpById', [id]),

  create: (data) =>
    callProcedure('CreateFollowUp', [
      data.student_id, data.assigned_to_id, data.followup_type_id,
      data.followup_date, data.remarks, data.next_followup_date, data.status
    ]),

  update: (id, data) =>
    callProcedure('UpdateFollowUp', [
      id, data.student_id, data.assigned_to_id, data.followup_type_id,
      data.followup_date, data.remarks, data.next_followup_date, data.status
    ]),

  remove: (id) =>
    callProcedure('DeleteFollowUp', [id])
};
