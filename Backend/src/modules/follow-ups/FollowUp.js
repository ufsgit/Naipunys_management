const { callProcedure } = require('../../config/db');

module.exports = {
  getAll: (studentId, status) =>
    callProcedure('GetFollowUps', [studentId, status]),

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
