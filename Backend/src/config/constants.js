const ROLES = {
  ADMIN: 'Admin',
  USER: 'User'
};

const STUDENT_STATUS = ['Active', 'Pending', 'Completed', 'Transferred'];
const FOLLOWUP_STATUS = ['Open', 'Converted', 'Closed'];
const ACCOUNT_TYPES = ['Bank', 'Cash', 'Asset', 'Income', 'Expense'];
const PAYMENT_MODES = ['Cash', 'Bank Transfer', 'Cheque', 'UPI'];
const SETTING_TYPES = ['followup_type', 'enquiry_source', 'status'];

module.exports = {
  ROLES,
  STUDENT_STATUS,
  FOLLOWUP_STATUS,
  ACCOUNT_TYPES,
  PAYMENT_MODES,
  SETTING_TYPES
};
