DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `CreateAccount`(IN p_code VARCHAR(30), IN p_name VARCHAR(100), IN p_type VARCHAR(30), IN p_branch_id INT, IN p_opening DECIMAL(12,2), IN p_current DECIMAL(12,2))
BEGIN
    INSERT INTO accounts (account_code, name, type, branch_id, opening_balance, current_balance, status) VALUES (p_code, p_name, p_type, p_branch_id, p_opening, p_current, 'Active');
    SELECT LAST_INSERT_ID() AS id;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `CreateBranch`(IN p_code VARCHAR(20), IN p_name VARCHAR(100), IN p_city VARCHAR(100), IN p_phone VARCHAR(30), IN p_address TEXT)
BEGIN
    INSERT INTO branches (code, name, city, phone, address, status) VALUES (p_code, p_name, p_city, p_phone, p_address, 'Active');
    SELECT LAST_INSERT_ID() AS id;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `CreateCourse`(IN p_code VARCHAR(20), IN p_name VARCHAR(150), IN p_department_id INT, IN p_duration VARCHAR(50), IN p_fee DECIMAL(10,2))
BEGIN
    INSERT INTO courses (code, name, department_id, duration, fee, status) VALUES (p_code, p_name, p_department_id, p_duration, p_fee, 'Active');
    SELECT LAST_INSERT_ID() AS id;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `CreateDepartment`(IN p_code VARCHAR(20), IN p_name VARCHAR(100), IN p_head INT)
BEGIN
    INSERT INTO departments (code, name, head_of_department_id, status) VALUES (p_code, p_name, p_head, 'Active');
    SELECT LAST_INSERT_ID() AS id;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `CreateFollowUp`(IN p_student_id INT, IN p_assigned_to INT, IN p_followup_type INT, IN p_date DATE, IN p_remarks TEXT, IN p_next_date DATE, IN p_status VARCHAR(20))
BEGIN
    INSERT INTO follow_ups (student_id, assigned_to_id, followup_type_id, followup_date, remarks, next_followup_date, status)
    VALUES (p_student_id, p_assigned_to, p_followup_type, p_date, p_remarks, p_next_date, p_status);
    SELECT LAST_INSERT_ID() AS id;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `CreatePayment`(IN p_voucher VARCHAR(30), IN p_date DATE, IN p_paid_to VARCHAR(150), IN p_category VARCHAR(100), IN p_account_id INT, IN p_branch_id INT, IN p_amount DECIMAL(12,2), IN p_mode VARCHAR(30), IN p_remarks TEXT)
BEGIN
    INSERT INTO payments (voucher_no, payment_date, paid_to, category, account_id, branch_id, amount, payment_mode, remarks)
    VALUES (p_voucher, p_date, p_paid_to, p_category, p_account_id, p_branch_id, p_amount, p_mode, p_remarks);
    SELECT LAST_INSERT_ID() AS id;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `CreateReceipt`(
    IN p_receipt_no VARCHAR(30), IN p_receipt_date DATE, IN p_received_from VARCHAR(150),
    IN p_student_id INT, IN p_course VARCHAR(150), IN p_branch_id INT, IN p_amount DECIMAL(12,2),
    IN p_voucher_no VARCHAR(30), IN p_details TEXT, IN p_to_account_id INT,
    IN p_payment_mode VARCHAR(30), IN p_reference_no VARCHAR(50), IN p_remark TEXT
)
BEGIN
    INSERT INTO receipts (receipt_no, receipt_date, received_from, student_id, course, branch_id,
        amount, voucher_no, details, to_account_id, payment_mode, reference_no, remark)
    VALUES (p_receipt_no, p_receipt_date, p_received_from, p_student_id, p_course, p_branch_id,
        p_amount, p_voucher_no, p_details, p_to_account_id, p_payment_mode, p_reference_no, p_remark);
    SELECT LAST_INSERT_ID() AS id;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `CreateRole`(IN p_name VARCHAR(100), IN p_role_under VARCHAR(100))
BEGIN
      INSERT INTO roles (name, role_under, status) VALUES (p_name, p_role_under, 'Active');
      SELECT LAST_INSERT_ID() AS id;
    END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `CreateSetting`(IN p_type VARCHAR(50), IN p_code VARCHAR(20), IN p_name VARCHAR(100), IN p_sort INT)
BEGIN
    INSERT INTO settings (type, code, name, sort_order, status) VALUES (p_type, p_code, p_name, p_sort, 'Active');
    SELECT LAST_INSERT_ID() AS id;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `CreateStudent`(
    IN p_student_code VARCHAR(30), IN p_name VARCHAR(150), IN p_phone VARCHAR(30),
    IN p_email VARCHAR(100), IN p_parents_mobile VARCHAR(30), IN p_whatsapp VARCHAR(30),
    IN p_address TEXT, IN p_facebook VARCHAR(100), IN p_alt_email VARCHAR(100),
    IN p_enquiry_source VARCHAR(100), IN p_enquiry_type VARCHAR(100), IN p_course_id INT,
    IN p_branch_id INT, IN p_department_id INT, IN p_batch VARCHAR(50),
    IN p_admission_date DATE, IN p_fees_total DECIMAL(10,2), IN p_fees_paid DECIMAL(10,2),
    IN p_status VARCHAR(30)
)
BEGIN
    INSERT INTO students (student_code, name, phone, email, parents_mobile, whatsapp, address,
        facebook, alt_email, enquiry_source, enquiry_type, course_id, branch_id, department_id,
        batch, admission_date, fees_total, fees_paid, status)
    VALUES (p_student_code, p_name, p_phone, p_email, p_parents_mobile, p_whatsapp, p_address,
        p_facebook, p_alt_email, p_enquiry_source, p_enquiry_type, p_course_id, p_branch_id,
        p_department_id, p_batch, p_admission_date, p_fees_total, p_fees_paid, p_status);
    SELECT LAST_INSERT_ID() AS id;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `CreateUser`(IN p_username VARCHAR(50), IN p_full_name VARCHAR(100), IN p_email VARCHAR(100), IN p_phone VARCHAR(30), IN p_role_id INT, IN p_branch_id INT, IN p_password VARCHAR(255))
BEGIN INSERT INTO users (username, full_name, email, phone, role_id, branch_id, password_hash, status) VALUES (p_username, p_full_name, p_email, p_phone, p_role_id, p_branch_id, SHA2(COALESCE(NULLIF(p_password, ''), 'admin123'), 256), 'Active'); SELECT LAST_INSERT_ID() AS id; END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `DeleteAccount`(IN p_id INT)
BEGIN DELETE FROM accounts WHERE id = p_id; SELECT ROW_COUNT() AS affected; END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `DeleteBranch`(IN p_id INT)
BEGIN DELETE FROM branches WHERE id = p_id; SELECT ROW_COUNT() AS affected; END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `DeleteCourse`(IN p_id INT)
BEGIN
    DELETE FROM courses WHERE id = p_id; SELECT ROW_COUNT() AS affected;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `DeleteDepartment`(IN p_id INT)
BEGIN DELETE FROM departments WHERE id = p_id; SELECT ROW_COUNT() AS affected; END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `DeleteFollowUp`(IN p_id INT)
BEGIN DELETE FROM follow_ups WHERE id = p_id; SELECT ROW_COUNT() AS affected; END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `DeletePayment`(IN p_id INT)
BEGIN DELETE FROM payments WHERE id = p_id; SELECT ROW_COUNT() AS affected; END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `DeleteReceipt`(IN p_id INT)
BEGIN DELETE FROM receipts WHERE id = p_id; SELECT ROW_COUNT() AS affected; END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `DeleteRole`(IN p_id INT)
BEGIN DELETE FROM roles WHERE id = p_id; SELECT ROW_COUNT() AS affected; END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `DeleteSetting`(IN p_id INT)
BEGIN UPDATE follow_ups SET followup_type_id = NULL WHERE followup_type_id = p_id; DELETE FROM settings WHERE id = p_id; SELECT ROW_COUNT() AS affected; END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `DeleteStudent`(IN p_id INT)
BEGIN DELETE FROM follow_ups WHERE student_id = p_id; UPDATE receipts SET student_id = NULL WHERE student_id = p_id; DELETE FROM students WHERE id = p_id; SELECT ROW_COUNT() AS affected; END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `DeleteUser`(IN p_id INT)
BEGIN DELETE FROM users WHERE id = p_id; SELECT ROW_COUNT() AS affected; END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAccountBranchConfigs`(IN p_account_id INT)
BEGIN
    SELECT abc.*, b.name AS branch_name FROM account_branch_configs abc LEFT JOIN branches b ON abc.branch_id = b.id WHERE abc.account_id = p_account_id;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAccountById`(IN p_id INT)
BEGIN
    SELECT a.*, b.name AS branch_name FROM accounts a LEFT JOIN branches b ON a.branch_id = b.id WHERE a.id = p_id;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAccounts`(IN p_branch_id INT)
BEGIN
    SELECT a.*, b.name AS branch_name FROM accounts a
    LEFT JOIN branches b ON a.branch_id = b.id
    WHERE (p_branch_id IS NULL OR a.branch_id = p_branch_id) ORDER BY a.id;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetBranchById`(IN p_id INT)
BEGIN SELECT * FROM branches WHERE id = p_id; END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetBranches`()
BEGIN
    SELECT * FROM branches WHERE status = 'Active' ORDER BY id;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetCompanyInfo`()
BEGIN
    SELECT * FROM company_info LIMIT 1;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetCourseById`(IN p_id INT)
BEGIN
    SELECT c.*, d.name AS department_name FROM courses c
    LEFT JOIN departments d ON c.department_id = d.id WHERE c.id = p_id;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetCourses`()
BEGIN
    SELECT c.*, d.name AS department_name FROM courses c
    LEFT JOIN departments d ON c.department_id = d.id
    WHERE c.status = 'Active' ORDER BY c.id;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetDepartmentById`(IN p_id INT)
BEGIN SELECT * FROM departments WHERE id = p_id; END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetDepartmentPermissions`()
BEGIN SELECT id, branch_name, department_name, sort_order FROM department_permissions ORDER BY sort_order, id; END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetDepartments`()
BEGIN
    SELECT * FROM departments WHERE status = 'Active' ORDER BY id;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetFeePendingReport`(IN p_branch_id INT)
BEGIN SELECT s.id, s.name, s.phone, s.branch_id, s.status, GREATEST(0, s.fees_total - COALESCE((SELECT SUM(r.amount) FROM receipts r WHERE r.student_id = s.id OR (r.student_id IS NULL AND LOWER(r.received_from) = LOWER(s.name))), s.fees_paid)) AS balance_amount FROM students s WHERE (p_branch_id IS NULL OR s.branch_id = p_branch_id) HAVING balance_amount > 0 ORDER BY s.name; END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetFeeReceiptReport`(IN p_from_date DATE, IN p_to_date DATE)
BEGIN SELECT r.receipt_no, r.receipt_date, COALESCE(NULLIF(s.name, ''), r.received_from, '') AS student_name, r.received_from, s.phone, s.email, r.course, r.branch_id, b.name AS branch_name, r.amount, r.payment_mode, r.details, r.voucher_no FROM receipts r LEFT JOIN students s ON r.student_id = s.id LEFT JOIN branches b ON COALESCE(r.branch_id, s.branch_id) = b.id WHERE r.receipt_date BETWEEN p_from_date AND p_to_date ORDER BY r.receipt_date DESC; END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetFollowUpById`(IN p_id INT)
BEGIN
    SELECT f.*, s.name AS student_name, u.full_name AS assigned_to_name, st.name AS followup_type_name
    FROM follow_ups f LEFT JOIN students s ON f.student_id = s.id
    LEFT JOIN users u ON f.assigned_to_id = u.id LEFT JOIN settings st ON f.followup_type_id = st.id
    WHERE f.id = p_id;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetFollowUps`(IN p_student_id INT, IN p_status VARCHAR(20))
BEGIN
    SELECT f.*, s.name AS student_name, u.full_name AS assigned_to_name, st.name AS followup_type_name
    FROM follow_ups f LEFT JOIN students s ON f.student_id = s.id
    LEFT JOIN users u ON f.assigned_to_id = u.id LEFT JOIN settings st ON f.followup_type_id = st.id
    WHERE (p_student_id IS NULL OR f.student_id = p_student_id) AND (p_status IS NULL OR f.status = p_status)
    ORDER BY f.followup_date DESC;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetMenuPermissions`()
BEGIN SELECT id, name, has_edit, has_delete, sort_order FROM menu_permissions ORDER BY sort_order, id; END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetPaymentById`(IN p_id INT)
BEGIN
    SELECT p.*, a.name AS account_name, b.name AS branch_name FROM payments p
    LEFT JOIN accounts a ON p.account_id = a.id LEFT JOIN branches b ON p.branch_id = b.id WHERE p.id = p_id;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetPayments`(IN p_branch_id INT, IN p_limit INT, IN p_offset INT)
BEGIN
    SELECT p.*, a.name AS account_name, b.name AS branch_name FROM payments p
    LEFT JOIN accounts a ON p.account_id = a.id LEFT JOIN branches b ON p.branch_id = b.id
    WHERE (p_branch_id IS NULL OR p.branch_id = p_branch_id)
    ORDER BY p.payment_date DESC LIMIT p_limit OFFSET p_offset;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetReceiptById`(IN p_id INT)
BEGIN
    SELECT r.*, s.name AS student_name FROM receipts r LEFT JOIN students s ON r.student_id = s.id WHERE r.id = p_id;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetReceipts`(IN p_branch_id INT, IN p_limit INT, IN p_offset INT)
BEGIN SELECT r.*, COALESCE(NULLIF(s.name, ''), r.received_from, '') AS student_name, a.name AS to_account_name, b.name AS branch_name FROM receipts r LEFT JOIN students s ON r.student_id = s.id LEFT JOIN accounts a ON r.to_account_id = a.id LEFT JOIN branches b ON COALESCE(r.branch_id, s.branch_id) = b.id WHERE (p_branch_id IS NULL OR r.branch_id = p_branch_id) ORDER BY r.receipt_date DESC LIMIT p_limit OFFSET p_offset; END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetRoles`()
BEGIN
      SELECT id, name, role_under, status, created_at, updated_at
      FROM roles
      WHERE status = 'Active'
      ORDER BY id;
    END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetSettingsByType`(IN p_type VARCHAR(50))
BEGIN
    SELECT * FROM settings WHERE type = p_type AND status = 'Active' ORDER BY sort_order;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetStudentById`(IN p_id INT)
BEGIN
    SELECT s.*, c.name AS course_name, b.name AS branch_name, d.name AS department_name
    FROM students s
    LEFT JOIN courses c ON s.course_id = c.id
    LEFT JOIN branches b ON s.branch_id = b.id
    LEFT JOIN departments d ON s.department_id = d.id
    WHERE s.id = p_id;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetStudents`(IN p_branch_id INT, IN p_status VARCHAR(30), IN p_limit INT, IN p_offset INT)
BEGIN
    SELECT s.*, c.name AS course_name, b.name AS branch_name, d.name AS department_name
    FROM students s
    LEFT JOIN courses c ON s.course_id = c.id
    LEFT JOIN branches b ON s.branch_id = b.id
    LEFT JOIN departments d ON s.department_id = d.id
    WHERE (p_branch_id IS NULL OR s.branch_id = p_branch_id)
      AND (p_status IS NULL OR s.status = p_status)
    ORDER BY s.created_at DESC
    LIMIT p_limit OFFSET p_offset;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetUserById`(IN p_id INT)
BEGIN
    SELECT u.id, u.username, u.full_name, u.email, u.phone, u.status, u.role_id, u.branch_id, r.name AS role_name, b.name AS branch_name
    FROM users u LEFT JOIN roles r ON u.role_id = r.id LEFT JOIN branches b ON u.branch_id = b.id WHERE u.id = p_id;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetUsers`()
BEGIN
    SELECT u.id, u.username, u.full_name, u.email, u.phone, u.status,
           r.name AS role_name, b.name AS branch_name
    FROM users u LEFT JOIN roles r ON u.role_id = r.id
    LEFT JOIN branches b ON u.branch_id = b.id ORDER BY u.id;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `Loginuser`(IN p_username VARCHAR(50), IN p_password VARCHAR(255))
BEGIN SELECT u.id, u.username, u.password_hash, u.role_id, u.branch_id, u.status, r.name AS role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.username = p_username AND u.password_hash = SHA2(p_password, 256) LIMIT 1; END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateAccount`(IN p_id INT, IN p_code VARCHAR(30), IN p_name VARCHAR(100), IN p_type VARCHAR(30), IN p_branch_id INT, IN p_opening DECIMAL(12,2), IN p_current DECIMAL(12,2), IN p_status VARCHAR(20))
BEGIN
    UPDATE accounts SET account_code = p_code, name = p_name, type = p_type, branch_id = p_branch_id, opening_balance = p_opening, current_balance = p_current, status = p_status WHERE id = p_id;
    SELECT ROW_COUNT() AS affected;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateBranch`(IN p_id INT, IN p_code VARCHAR(20), IN p_name VARCHAR(100), IN p_city VARCHAR(100), IN p_phone VARCHAR(30), IN p_address TEXT, IN p_status VARCHAR(20))
BEGIN
    UPDATE branches SET code = p_code, name = p_name, city = p_city, phone = p_phone, address = p_address, status = p_status WHERE id = p_id;
    SELECT ROW_COUNT() AS affected;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateCompanyInfo`(IN p_id INT, IN p_name VARCHAR(200), IN p_phone VARCHAR(30), IN p_email VARCHAR(100), IN p_address TEXT, IN p_land_phone VARCHAR(30), IN p_website VARCHAR(200))
BEGIN
    UPDATE company_info SET company_name = p_name, phone_no = p_phone, email = p_email, address = p_address, land_phone = p_land_phone, website = p_website WHERE id = p_id;
    SELECT ROW_COUNT() AS affected;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateCourse`(IN p_id INT, IN p_code VARCHAR(20), IN p_name VARCHAR(150), IN p_department_id INT, IN p_duration VARCHAR(50), IN p_fee DECIMAL(10,2), IN p_status VARCHAR(20))
BEGIN
    UPDATE courses SET code = p_code, name = p_name, department_id = p_department_id, duration = p_duration, fee = p_fee, status = p_status WHERE id = p_id;
    SELECT ROW_COUNT() AS affected;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateDepartment`(IN p_id INT, IN p_code VARCHAR(20), IN p_name VARCHAR(100), IN p_head INT, IN p_status VARCHAR(20))
BEGIN
    UPDATE departments SET code = p_code, name = p_name, head_of_department_id = p_head, status = p_status WHERE id = p_id;
    SELECT ROW_COUNT() AS affected;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateFollowUp`(IN p_id INT, IN p_student_id INT, IN p_assigned_to INT, IN p_followup_type INT, IN p_date DATE, IN p_remarks TEXT, IN p_next_date DATE, IN p_status VARCHAR(20))
BEGIN
    UPDATE follow_ups SET student_id = p_student_id, assigned_to_id = p_assigned_to, followup_type_id = p_followup_type, followup_date = p_date, remarks = p_remarks, next_followup_date = p_next_date, status = p_status WHERE id = p_id;
    SELECT ROW_COUNT() AS affected;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdatePayment`(IN p_id INT, IN p_voucher VARCHAR(30), IN p_date DATE, IN p_paid_to VARCHAR(150), IN p_category VARCHAR(100), IN p_account_id INT, IN p_branch_id INT, IN p_amount DECIMAL(12,2), IN p_mode VARCHAR(30), IN p_remarks TEXT)
BEGIN
    UPDATE payments SET voucher_no = p_voucher, payment_date = p_date, paid_to = p_paid_to, category = p_category, account_id = p_account_id, branch_id = p_branch_id, amount = p_amount, payment_mode = p_mode, remarks = p_remarks WHERE id = p_id;
    SELECT ROW_COUNT() AS affected;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateReceipt`(IN p_id INT, IN p_receipt_date DATE, IN p_received_from VARCHAR(150), IN p_student_id INT, IN p_course VARCHAR(100), IN p_branch_id INT, IN p_amount DECIMAL(10,2), IN p_voucher_no VARCHAR(50), IN p_details TEXT, IN p_to_account_id INT)
BEGIN UPDATE receipts SET receipt_date = p_receipt_date, received_from = p_received_from, student_id = COALESCE(p_student_id, student_id), course = COALESCE(NULLIF(p_course, ''), course), branch_id = COALESCE(p_branch_id, branch_id), amount = p_amount, voucher_no = p_voucher_no, details = p_details, to_account_id = p_to_account_id WHERE id = p_id; SELECT ROW_COUNT() AS affected; END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateRole`(IN p_id INT, IN p_name VARCHAR(100), IN p_role_under VARCHAR(100), IN p_status VARCHAR(20))
BEGIN
      UPDATE roles SET name = p_name, role_under = p_role_under, status = p_status WHERE id = p_id;
      SELECT ROW_COUNT() AS affected;
    END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateSetting`(IN p_id INT, IN p_name VARCHAR(100), IN p_sort INT, IN p_status VARCHAR(20))
BEGIN
    UPDATE settings SET name = p_name, sort_order = p_sort, status = p_status WHERE id = p_id;
    SELECT ROW_COUNT() AS affected;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateStudent`(
    IN p_id INT, IN p_name VARCHAR(150), IN p_phone VARCHAR(30), IN p_email VARCHAR(100),
    IN p_course_id INT, IN p_branch_id INT, IN p_department_id INT,
    IN p_fees_total DECIMAL(10,2), IN p_fees_paid DECIMAL(10,2), IN p_status VARCHAR(30)
)
BEGIN
    UPDATE students SET name = p_name, phone = p_phone, email = p_email,
        course_id = p_course_id, branch_id = p_branch_id, department_id = p_department_id,
        fees_total = p_fees_total, fees_paid = p_fees_paid, status = p_status WHERE id = p_id;
    SELECT ROW_COUNT() AS affected;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateUser`(IN p_id INT, IN p_username VARCHAR(50), IN p_full_name VARCHAR(100), IN p_email VARCHAR(100), IN p_phone VARCHAR(30), IN p_role_id INT, IN p_branch_id INT, IN p_status VARCHAR(20))
BEGIN
    UPDATE users SET username = p_username, full_name = p_full_name, email = p_email, phone = p_phone, role_id = p_role_id, branch_id = p_branch_id, status = p_status WHERE id = p_id;
    SELECT ROW_COUNT() AS affected;
END$$
DELIMITER ;
