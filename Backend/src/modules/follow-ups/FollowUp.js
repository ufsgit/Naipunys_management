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

  create: async (data) => {
    try {
      const [res] = await pool.query(
        'INSERT INTO follow_ups (student_id, assigned_to_id, followup_type_id, followup_date, remarks, next_followup_date, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          data.student_id,
          data.assigned_to_id || null,
          data.followup_type_id || null,
          data.followup_date || new Date().toISOString().slice(0, 10),
          data.remarks || '',
          data.next_followup_date || null,
          data.status || 'Open'
        ]
      );
      return [{ id: res.insertId }];
    } catch (err) {
      console.warn('[FollowUp.create] direct insert fallback:', err.message);
      return callProcedure('CreateFollowUp', [
        data.student_id, data.assigned_to_id, data.followup_type_id,
        data.followup_date, data.remarks, data.next_followup_date, data.status
      ]);
    }
  },

  update: (id, data) =>
    callProcedure('UpdateFollowUp', [
      id, data.student_id, data.assigned_to_id, data.followup_type_id,
      data.followup_date, data.remarks, data.next_followup_date, data.status
    ]),

  remove: (id) =>
    callProcedure('DeleteFollowUp', [id])
};
