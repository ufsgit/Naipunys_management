const { callProcedure } = require('../config/db');

module.exports = {
  getAll: (studentId, status) =>
    callProcedure('sp_GetFollowUps', [studentId, status]),

  getById: (id) =>
    callProcedure('sp_GetFollowUpById', [id]),

  create: (data) =>
    callProcedure('sp_CreateFollowUp', [
      data.student_id, data.assigned_to_id, data.followup_type_id,
      data.followup_date, data.remarks, data.next_followup_date, data.status
    ]),

  update: (id, data) =>
    callProcedure('sp_UpdateFollowUp', [
      id, data.student_id, data.assigned_to_id, data.followup_type_id,
      data.followup_date, data.remarks, data.next_followup_date, data.status
    ]),

  remove: (id) =>
    callProcedure('sp_DeleteFollowUp', [id])
};
