import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Student {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  course: string;
  branch: string;
  department: string;
  batch: string;
  admissionDate: string;
  feesTotal: number;
  feesPaid: number;
  status: 'Active' | 'Pending' | 'Completed' | 'Transferred';
}

export interface StudentFollowUp {
  id: string;
  studentId: string;
  studentName: string;
  phone: string;
  course: string;
  date: string;
  type: string;
  enquirySource: string;
  remark: string;
  nextFollowUpDate: string;
  status: 'Open' | 'Converted' | 'Closed';
}

export interface Course {
  id: string;
  code: string;
  name: string;
  department: string;
  duration: string;
  fee: number;
  status: 'Active' | 'Inactive';
}

export interface Department {
  id: string;
  code: string;
  name: string;
  headOfDepartment: string;
  status: 'Active' | 'Inactive';
}

export interface Branch {
  id: string;
  code: string;
  name: string;
  city: string;
  phone: string;
  address: string;
  status: 'Active' | 'Inactive';
}

export interface BranchAccountConfig {
  branch: string;
  selected: boolean;
  opening: number;
  type: string;
}

export interface Account {
  id: string;
  code?: string;
  name: string;
  details?: string;
  description?: string;
  type?: 'Bank' | 'Cash' | 'Asset' | 'Income' | 'Expense' | string;
  branch?: string;
  openingBalance?: number;
  currentBalance?: number;
  status?: 'Active' | 'Inactive';
  branchConfigs?: BranchAccountConfig[];
}

export interface Receipt {
  id: string;
  receiptNo: string;
  date: string;
  from?: string;
  studentId: string;
  studentName: string;
  course: string;
  branch: string;
  amount: number;
  voucherNo?: string | number;
  details?: string;
  toAccount?: string;
  paymentMode: 'Cash' | 'Bank Transfer' | 'Cheque' | 'UPI' | string;
  referenceNo?: string;
  remark?: string;
}

export interface Payment {
  id: string;
  voucherNo: string;
  date: string;
  paidTo: string;
  category: string;
  account: string;
  branch: string;
  amount: number;
  paymentMode: 'Cash' | 'Bank Transfer' | 'Cheque';
  remarks?: string;
}

export interface UserRole {
  id: string;
  name: string;
  description: string;
  permissionsCount: number;
  status: 'Active' | 'Inactive';
}

export interface SystemUser {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  branch: string;
  status: 'Active' | 'Inactive';
}

export interface SettingItem {
  id: string;
  code: string;
  name: string;
  description?: string;
  status: 'Active' | 'Inactive';
}

export interface CompanyInfo {
  name: string;
  tagline: string;
  registrationNo: string;
  taxId: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  currency: string;
}

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  // Current active branch
  private currentBranchSubject = new BehaviorSubject<string>('Main Campus - Kochi');
  currentBranch$ = this.currentBranchSubject.asObservable();

  // 1. Departments
  private departments: Department[] = [
    { id: '1', code: 'DEP-01', name: 'Information Technology', headOfDepartment: 'Dr. Ramesh Kumar', status: 'Active' },
    { id: '2', code: 'DEP-02', name: 'Business Administration', headOfDepartment: 'Prof. Anjali Nair', status: 'Active' },
    { id: '3', code: 'DEP-03', name: 'Design & Multimedia', headOfDepartment: 'Vikram Seth', status: 'Active' },
    { id: '4', code: 'DEP-04', name: 'Accounting & Finance', headOfDepartment: 'Suresh Menon', status: 'Active' }
  ];
  private departments$ = new BehaviorSubject<Department[]>(this.departments);

  // 2. Branches
  private branches: Branch[] = [
    { id: '1', code: 'BR-KCH', name: 'Main Campus - Kochi', city: 'Kochi', phone: '+91 484 2345678', address: 'MG Road, Kochi, Kerala', status: 'Active' },
    { id: '2', code: 'BR-TVM', name: 'Trivandrum City Branch', city: 'Trivandrum', phone: '+91 471 2890123', address: 'Statue Junction, Trivandrum', status: 'Active' },
    { id: '3', code: 'BR-CLT', name: 'Calicut Campus', city: 'Calicut', phone: '+91 495 2765432', address: 'Mavoor Road, Calicut', status: 'Active' }
  ];
  private branches$ = new BehaviorSubject<Branch[]>(this.branches);

  // 3. Courses
  private courses: Course[] = [
    { id: '1', code: 'CRS-FSW', name: 'Full Stack Web Development', department: 'Information Technology', duration: '6 Months', fee: 45000, status: 'Active' },
    { id: '2', code: 'CRS-DS', name: 'Data Science & Machine Learning', department: 'Information Technology', duration: '8 Months', fee: 55000, status: 'Active' },
    { id: '3', code: 'CRS-DGM', name: 'Digital Marketing Specialist', department: 'Business Administration', duration: '4 Months', fee: 28000, status: 'Active' },
    { id: '4', code: 'CRS-GDS', name: 'Graphic & UI/UX Design', department: 'Design & Multimedia', duration: '5 Months', fee: 35000, status: 'Active' },
    { id: '5', code: 'CRS-CFA', name: 'Certified Financial Accounting', department: 'Accounting & Finance', duration: '6 Months', fee: 32000, status: 'Active' }
  ];
  private courses$ = new BehaviorSubject<Course[]>(this.courses);

  // 4. Students
  private students: Student[] = [
    { id: '1', code: 'STU-1001', name: 'Rahul Krishnan', phone: '9847012345', email: 'rahul.k@example.com', course: 'Full Stack Web Development', branch: 'Main Campus - Kochi', department: 'Information Technology', batch: '2026-Batch A', admissionDate: '2026-01-10', feesTotal: 45000, feesPaid: 45000, status: 'Active' },
    { id: '2', code: 'STU-1002', name: 'Sneha Thomas', phone: '9847123456', email: 'sneha.t@example.com', course: 'Data Science & Machine Learning', branch: 'Main Campus - Kochi', department: 'Information Technology', batch: '2026-Batch B', admissionDate: '2026-01-15', feesTotal: 55000, feesPaid: 35000, status: 'Active' },
    { id: '3', code: 'STU-1003', name: 'Arjun Pillai', phone: '9847234567', email: 'arjun.p@example.com', course: 'Digital Marketing Specialist', branch: 'Trivandrum City Branch', department: 'Business Administration', batch: '2026-Batch A', admissionDate: '2026-02-01', feesTotal: 28000, feesPaid: 15000, status: 'Active' },
    { id: '4', code: 'STU-1004', name: 'Devika Mohan', phone: '9847345678', email: 'devika.m@example.com', course: 'Graphic & UI/UX Design', branch: 'Calicut Campus', department: 'Design & Multimedia', batch: '2026-Batch A', admissionDate: '2026-02-12', feesTotal: 35000, feesPaid: 35000, status: 'Completed' },
    { id: '5', code: 'STU-1005', name: 'Fahad Mohammed', phone: '9847456789', email: 'fahad.m@example.com', course: 'Certified Financial Accounting', branch: 'Main Campus - Kochi', department: 'Accounting & Finance', batch: '2026-Batch C', admissionDate: '2026-02-20', feesTotal: 32000, feesPaid: 16000, status: 'Active' },
    { id: '6', code: 'STU-1006', name: 'Ananya Sharma', phone: '9847567890', email: 'ananya.s@example.com', course: 'Full Stack Web Development', branch: 'Trivandrum City Branch', department: 'Information Technology', batch: '2026-Batch B', admissionDate: '2026-03-01', feesTotal: 45000, feesPaid: 20000, status: 'Active' },
    { id: '7', code: 'STU-1007', name: 'Vishnu Prasad', phone: '9847678901', email: 'vishnu.p@example.com', course: 'Data Science & Machine Learning', branch: 'Calicut Campus', department: 'Information Technology', batch: '2026-Batch A', admissionDate: '2026-03-05', feesTotal: 55000, feesPaid: 10000, status: 'Active' }
  ];
  private students$ = new BehaviorSubject<Student[]>(this.students);

  // 5. Follow-ups
  private followUps: StudentFollowUp[] = [
    { id: '1', studentId: 'STU-1002', studentName: 'Sneha Thomas', phone: '9847123456', course: 'Data Science & Machine Learning', date: '2026-03-10', type: 'Fee Reminder Call', enquirySource: 'Direct Walk-in', remark: 'Second installment due next Monday', nextFollowUpDate: '2026-03-18', status: 'Open' },
    { id: '2', studentId: 'STU-1003', studentName: 'Arjun Pillai', phone: '9847234567', course: 'Digital Marketing Specialist', date: '2026-03-12', type: 'Course Feedback', enquirySource: 'Social Media', remark: 'Satisfied with practical labs', nextFollowUpDate: '2026-03-25', status: 'Closed' },
    { id: '3', studentId: 'STU-1005', studentName: 'Fahad Mohammed', phone: '9847456789', course: 'Certified Financial Accounting', date: '2026-03-14', type: 'Attendance Review', enquirySource: 'Website', remark: 'Missed two sessions due to fever', nextFollowUpDate: '2026-03-22', status: 'Open' }
  ];
  private followUps$ = new BehaviorSubject<StudentFollowUp[]>(this.followUps);

  // 6. Receipts
  private receipts: Receipt[] = [
    { id: '1', receiptNo: '1', voucherNo: '1', date: '19-Nov-2026', from: 'MEERA NAIR', studentId: 'STU-1001', studentName: 'MEERA NAIR', course: 'IELTS CRASH', branch: 'Ernakulam', amount: 5000, paymentMode: 'Bank Transfer', toAccount: 'HDFC Current Account', details: 'QR CODE BY BANK - IELTS COURSE FEE' },
    { id: '2', receiptNo: '2', voucherNo: '2', date: '21-Nov-2026', from: 'ANANYA KRISHNAN', studentId: 'STU-1002', studentName: 'ANANYA KRISHNAN', course: 'OET', branch: 'Ernakulam', amount: 7500, paymentMode: 'UPI', toAccount: 'SBI Fee Collection', details: 'OET ADMISSION INSTALLMENT' }
  ];
  private receipts$ = new BehaviorSubject<Receipt[]>(this.receipts);

  // 7. Payments
  private payments: Payment[] = [
    { id: '1', voucherNo: 'VCH-2026-101', date: '2026-01-05', paidTo: 'Kerala State Electricity Board', category: 'Utilities', account: 'SBT Current A/C', branch: 'Main Campus - Kochi', amount: 8450, paymentMode: 'Bank Transfer', remarks: 'Dec electricity bill' },
    { id: '2', voucherNo: 'VCH-2026-102', date: '2026-01-12', paidTo: 'Asianet Broadband', category: 'Internet', account: 'Main Petty Cash', branch: 'Main Campus - Kochi', amount: 2400, paymentMode: 'Cash', remarks: 'Campus fiber connection' },
    { id: '3', voucherNo: 'VCH-2026-103', date: '2026-01-30', paidTo: 'Faculty Remuneration Pool', category: 'Salaries', account: 'SBT Current A/C', branch: 'Main Campus - Kochi', amount: 120000, paymentMode: 'Bank Transfer', remarks: 'Visiting trainers salary' },
    { id: '4', voucherNo: 'VCH-2026-104', date: '2026-02-04', paidTo: 'Modern Stationeries', category: 'Office Supplies', account: 'Main Petty Cash', branch: 'Trivandrum City Branch', amount: 3100, paymentMode: 'Cash', remarks: 'Notebooks & markers' }
  ];
  private payments$ = new BehaviorSubject<Payment[]>(this.payments);

  // 8. Accounts
  private accounts: Account[] = [
    { id: '1', code: 'ACC-101', name: 'CASH IN HAND', details: 'Front-desk petty & fee cash', description: 'Front-desk petty cash and daily cash collection', type: 'Cash', branch: 'Ernakulam', openingBalance: 25000, currentBalance: 25000, status: 'Active' },
    { id: '2', code: 'ACC-102', name: 'HDFC Current Account', details: 'A/C •••• 4821 • Ravipuram', description: 'Main HDFC operating account', type: 'Bank', branch: 'Kaloor', openingBalance: 180000, currentBalance: 180000, status: 'Active' },
    { id: '3', code: 'ACC-103', name: 'SBI Fee Collection', details: 'A/C •••• 9104 • UPI Gateway', description: 'SBI UPI and online fee collection', type: 'Bank', branch: 'Ernakulam', openingBalance: 250000, currentBalance: 250000, status: 'Active' }
  ];
  private accounts$ = new BehaviorSubject<Account[]>(this.accounts);

  // 9. User Roles
  private userRoles: UserRole[] = [
    { id: '1', name: 'Super Administrator', description: 'Full system access across all branches and modules', permissionsCount: 48, status: 'Active' },
    { id: '2', name: 'Branch Manager', description: 'Branch specific management, admissions and fee approvals', permissionsCount: 32, status: 'Active' },
    { id: '3', name: 'Accountant / Cashier', description: 'Fee receipt collection, vouchers and financial reporting', permissionsCount: 22, status: 'Active' },
    { id: '4', name: 'Academic Counselor', description: 'Student enquiry, admission follow-up and registration', permissionsCount: 16, status: 'Active' }
  ];
  private userRoles$ = new BehaviorSubject<UserRole[]>(this.userRoles);

  // 10. Users
  private systemUsers: SystemUser[] = [
    { id: '1', username: 'admin', fullName: 'System Administrator', email: 'admin@naipunyainstitute.org', phone: '+91 9447001122', role: 'Super Administrator', branch: 'Main Campus - Kochi', status: 'Active' },
    { id: '2', username: 'kavitha.m', fullName: 'Kavitha Madhavan', email: 'kavitha@naipunyainstitute.org', phone: '+91 9447112233', role: 'Branch Manager', branch: 'Main Campus - Kochi', status: 'Active' },
    { id: '3', username: 'pradeep.k', fullName: 'Pradeep Kumar', email: 'pradeep@naipunyainstitute.org', phone: '+91 9447223344', role: 'Accountant / Cashier', branch: 'Main Campus - Kochi', status: 'Active' },
    { id: '4', username: 'maya.s', fullName: 'Maya Sreekumar', email: 'maya@naipunyainstitute.org', phone: '+91 9447334455', role: 'Academic Counselor', branch: 'Trivandrum City Branch', status: 'Active' }
  ];
  private systemUsers$ = new BehaviorSubject<SystemUser[]>(this.systemUsers);

  // 11. Settings (Follow-up Types, Enquiry Sources, Statuses)
  private followupTypes: SettingItem[] = [
    { id: '1', code: 'FT-01', name: 'Phone Call', description: 'Voice discussion with applicant/student', status: 'Active' },
    { id: '2', code: 'FT-02', name: 'Campus Visit', description: 'In-person meeting at institute office', status: 'Active' },
    { id: '3', code: 'FT-03', name: 'WhatsApp Message', description: 'Official chat reminder and brochure sharing', status: 'Active' },
    { id: '4', code: 'FT-04', name: 'Email Follow-up', description: 'Detailed prospectus or fee schedule dispatch', status: 'Active' }
  ];
  private followupTypes$ = new BehaviorSubject<SettingItem[]>(this.followupTypes);

  private enquirySources: SettingItem[] = [
    { id: '1', code: 'SRC-01', name: 'Direct Walk-in', description: 'Student came to campus directly', status: 'Active' },
    { id: '2', code: 'SRC-02', name: 'Website / Online Portal', description: 'Enquiry form submitted via web', status: 'Active' },
    { id: '3', code: 'SRC-03', name: 'Social Media (Meta/Instagram)', description: 'Lead ad campaign response', status: 'Active' },
    { id: '4', code: 'SRC-04', name: 'Alumni Referral', description: 'Referred by passed-out student', status: 'Active' },
    { id: '5', code: 'SRC-05', name: 'Newspaper / Print Media', description: 'Advertisement in daily paper', status: 'Active' }
  ];
  private enquirySources$ = new BehaviorSubject<SettingItem[]>(this.enquirySources);

  private statusItems: SettingItem[] = [
    { id: '1', code: 'ST-01', name: 'Active', description: 'Current valid record', status: 'Active' },
    { id: '2', code: 'ST-02', name: 'Pending Verification', description: 'Awaiting administrative check', status: 'Active' },
    { id: '3', code: 'ST-03', name: 'Course Completed', description: 'Successfully finished training', status: 'Active' },
    { id: '4', code: 'ST-04', name: 'Transferred', description: 'Shifted to another branch or program', status: 'Active' }
  ];
  private statusItems$ = new BehaviorSubject<SettingItem[]>(this.statusItems);

  // 12. Company Information
  private companyInfo: CompanyInfo = {
    name: 'Naipunya Institute of Management & Technology',
    tagline: 'Empowering Careers Through Quality Professional Education',
    registrationNo: 'REG/KRL/2012/88741',
    taxId: 'GSTIN32AABCN1234F1Z9',
    email: 'info@naipunyainstitute.org',
    phone: '+91 484 2800000 / +91 484 2800001',
    website: 'https://naipunyainstitute.org',
    address: 'Naipunya Knowledge Park, Near Infopark Expressway',
    city: 'Kochi',
    state: 'Kerala',
    pincode: '682030',
    currency: 'INR (₹)'
  };
  private companyInfo$ = new BehaviorSubject<CompanyInfo>(this.companyInfo);

  // Observables
  getDepartments(): Observable<Department[]> { return this.departments$.asObservable(); }
  getBranches(): Observable<Branch[]> { return this.branches$.asObservable(); }
  getCourses(): Observable<Course[]> { return this.courses$.asObservable(); }
  getStudents(): Observable<Student[]> { return this.students$.asObservable(); }
  getFollowUps(): Observable<StudentFollowUp[]> { return this.followUps$.asObservable(); }
  getReceipts(): Observable<Receipt[]> { return this.receipts$.asObservable(); }
  getPayments(): Observable<Payment[]> { return this.payments$.asObservable(); }
  getAccounts(): Observable<Account[]> { return this.accounts$.asObservable(); }
  getUserRoles(): Observable<UserRole[]> { return this.userRoles$.asObservable(); }
  getSystemUsers(): Observable<SystemUser[]> { return this.systemUsers$.asObservable(); }
  getFollowupTypes(): Observable<SettingItem[]> { return this.followupTypes$.asObservable(); }
  getEnquirySources(): Observable<SettingItem[]> { return this.enquirySources$.asObservable(); }
  getStatusItems(): Observable<SettingItem[]> { return this.statusItems$.asObservable(); }
  getCompanyInfo(): Observable<CompanyInfo> { return this.companyInfo$.asObservable(); }

  setBranch(branch: string) {
    this.currentBranchSubject.next(branch);
  }

  // Student Methods
  addStudent(student: Omit<Student, 'id' | 'code'>): Student {
    const newStudent: Student = {
      ...student,
      id: String(Date.now()),
      code: `STU-${1000 + this.students.length + 1}`
    };
    this.students = [newStudent, ...this.students];
    this.students$.next([...this.students]);
    return newStudent;
  }

  updateStudent(id: string, updated: Partial<Student>) {
    this.students = this.students.map(s => s.id === id ? { ...s, ...updated } : s);
    this.students$.next([...this.students]);
  }

  deleteStudent(id: string) {
    this.students = this.students.filter(s => s.id !== id);
    this.students$.next([...this.students]);
  }

  // Follow-up Methods
  addFollowUp(item: Omit<StudentFollowUp, 'id'>) {
    const newItem: StudentFollowUp = { ...item, id: String(Date.now()) };
    this.followUps = [newItem, ...this.followUps];
    this.followUps$.next([...this.followUps]);
  }

  updateFollowUp(id: string, updated: Partial<StudentFollowUp>) {
    this.followUps = this.followUps.map(f => f.id === id ? { ...f, ...updated } : f);
    this.followUps$.next([...this.followUps]);
  }

  deleteFollowUp(id: string) {
    this.followUps = this.followUps.filter(f => f.id !== id);
    this.followUps$.next([...this.followUps]);
  }

  // Course Methods
  addCourse(course: Omit<Course, 'id' | 'code'>): Course {
    const newCourse: Course = {
      ...course,
      id: String(Date.now()),
      code: `CRS-${course.name.substring(0, 3).toUpperCase()}`
    };
    this.courses = [newCourse, ...this.courses];
    this.courses$.next([...this.courses]);
    return newCourse;
  }

  updateCourse(id: string, updated: Partial<Course>) {
    this.courses = this.courses.map(c => c.id === id ? { ...c, ...updated } : c);
    this.courses$.next([...this.courses]);
  }

  deleteCourse(id: string) {
    this.courses = this.courses.filter(c => c.id !== id);
    this.courses$.next([...this.courses]);
  }

  // Department Methods
  addDepartment(dept: Omit<Department, 'id' | 'code'>): Department {
    const newDept: Department = {
      ...dept,
      id: String(Date.now()),
      code: `DEP-0${this.departments.length + 1}`
    };
    this.departments = [newDept, ...this.departments];
    this.departments$.next([...this.departments]);
    return newDept;
  }

  updateDepartment(id: string, updated: Partial<Department>) {
    this.departments = this.departments.map(d => d.id === id ? { ...d, ...updated } : d);
    this.departments$.next([...this.departments]);
  }

  deleteDepartment(id: string) {
    this.departments = this.departments.filter(d => d.id !== id);
    this.departments$.next([...this.departments]);
  }

  // Branch Methods
  addBranch(branch: Omit<Branch, 'id' | 'code'>): Branch {
    const newBranch: Branch = {
      ...branch,
      id: String(Date.now()),
      code: `BR-${branch.city.substring(0, 3).toUpperCase()}`
    };
    this.branches = [newBranch, ...this.branches];
    this.branches$.next([...this.branches]);
    return newBranch;
  }

  updateBranch(id: string, updated: Partial<Branch>) {
    this.branches = this.branches.map(b => b.id === id ? { ...b, ...updated } : b);
    this.branches$.next([...this.branches]);
  }

  deleteBranch(id: string) {
    this.branches = this.branches.filter(b => b.id !== id);
    this.branches$.next([...this.branches]);
  }

  // Account Methods
  addAccount(acc: Omit<Account, 'id' | 'code'>): Account {
    const newAcc: Account = {
      ...acc,
      id: String(Date.now()),
      code: `ACC-${100 + this.accounts.length + 1}`
    };
    this.accounts = [newAcc, ...this.accounts];
    this.accounts$.next([...this.accounts]);
    return newAcc;
  }

  updateAccount(id: string, updated: Partial<Account>) {
    this.accounts = this.accounts.map(a => a.id === id ? { ...a, ...updated } : a);
    this.accounts$.next([...this.accounts]);
  }

  deleteAccount(id: string) {
    this.accounts = this.accounts.filter(a => a.id !== id);
    this.accounts$.next([...this.accounts]);
  }

  // Receipt Methods
  addReceipt(receipt: Omit<Receipt, 'id' | 'receiptNo'>): Receipt {
    const newReceipt: Receipt = {
      ...receipt,
      id: String(Date.now()),
      receiptNo: `RCP-2026-${String(this.receipts.length + 1).padStart(3, '0')}`
    };
    this.receipts = [newReceipt, ...this.receipts];
    this.receipts$.next([...this.receipts]);

    // Update student paid amount
    const student = this.students.find(s => s.code === receipt.studentId || s.name === receipt.studentName);
    if (student) {
      this.updateStudent(student.id, {
        feesPaid: (student.feesPaid || 0) + Number(receipt.amount)
      });
    }

    return newReceipt;
  }

  deleteReceipt(id: string) {
    this.receipts = this.receipts.filter(r => r.id !== id);
    this.receipts$.next([...this.receipts]);
  }

  // Payment Methods
  addPayment(pmt: Omit<Payment, 'id' | 'voucherNo'>): Payment {
    const newPayment: Payment = {
      ...pmt,
      id: String(Date.now()),
      voucherNo: `VCH-2026-${100 + this.payments.length + 1}`
    };
    this.payments = [newPayment, ...this.payments];
    this.payments$.next([...this.payments]);
    return newPayment;
  }

  deletePayment(id: string) {
    this.payments = this.payments.filter(p => p.id !== id);
    this.payments$.next([...this.payments]);
  }

  // User Role Methods
  addUserRole(role: Omit<UserRole, 'id'>): UserRole {
    const newRole: UserRole = { ...role, id: String(Date.now()) };
    this.userRoles = [newRole, ...this.userRoles];
    this.userRoles$.next([...this.userRoles]);
    return newRole;
  }

  updateUserRole(id: string, updated: Partial<UserRole>) {
    this.userRoles = this.userRoles.map(r => r.id === id ? { ...r, ...updated } : r);
    this.userRoles$.next([...this.userRoles]);
  }

  deleteUserRole(id: string) {
    this.userRoles = this.userRoles.filter(r => r.id !== id);
    this.userRoles$.next([...this.userRoles]);
  }

  // User Methods
  addUser(user: Omit<SystemUser, 'id'>): SystemUser {
    const newUser: SystemUser = { ...user, id: String(Date.now()) };
    this.systemUsers = [newUser, ...this.systemUsers];
    this.systemUsers$.next([...this.systemUsers]);
    return newUser;
  }

  updateUser(id: string, updated: Partial<SystemUser>) {
    this.systemUsers = this.systemUsers.map(u => u.id === id ? { ...u, ...updated } : u);
    this.systemUsers$.next([...this.systemUsers]);
  }

  deleteUser(id: string) {
    this.systemUsers = this.systemUsers.filter(u => u.id !== id);
    this.systemUsers$.next([...this.systemUsers]);
  }

  // Settings Methods
  addSetting(type: 'followup' | 'enquiry' | 'status', item: Omit<SettingItem, 'id' | 'code'>) {
    const newItem: SettingItem = {
      ...item,
      id: String(Date.now()),
      code: `${type.substring(0, 2).toUpperCase()}-${Date.now().toString().slice(-3)}`
    };
    if (type === 'followup') {
      this.followupTypes = [newItem, ...this.followupTypes];
      this.followupTypes$.next([...this.followupTypes]);
    } else if (type === 'enquiry') {
      this.enquirySources = [newItem, ...this.enquirySources];
      this.enquirySources$.next([...this.enquirySources]);
    } else {
      this.statusItems = [newItem, ...this.statusItems];
      this.statusItems$.next([...this.statusItems]);
    }
  }

  deleteSetting(type: 'followup' | 'enquiry' | 'status', id: string) {
    if (type === 'followup') {
      this.followupTypes = this.followupTypes.filter(i => i.id !== id);
      this.followupTypes$.next([...this.followupTypes]);
    } else if (type === 'enquiry') {
      this.enquirySources = this.enquirySources.filter(i => i.id !== id);
      this.enquirySources$.next([...this.enquirySources]);
    } else {
      this.statusItems = this.statusItems.filter(i => i.id !== id);
      this.statusItems$.next([...this.statusItems]);
    }
  }

  // Company Info Update
  updateCompanyInfo(info: CompanyInfo) {
    this.companyInfo = { ...info };
    this.companyInfo$.next({ ...this.companyInfo });
  }
}
