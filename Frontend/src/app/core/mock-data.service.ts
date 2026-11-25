import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

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

export interface StudentListRow {
  slNo: number;
  name: string;
  followUp?: string;
  note: string;
  mobile: string;
  remark: string;
  nextFollowUp: string;
  department: string;
  status: string;
  to: string;
  from: string;
  branch?: string;
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

export interface CourseItem {
  slNo: number;
  name: string;
  fees: number;
  hasDelete: boolean;
  hasEdit: boolean;
}

export interface CourseBranchFee {
  slNo: number;
  branch: string;
  fees: string | number;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  headOfDepartment: string;
  status: 'Active' | 'Inactive';
}

export interface DepartmentItem {
  slNo: number;
  name: string;
  followUp: string;
  order: number;
}

export interface StatusOption {
  slNo: number;
  selected: boolean;
  name: string;
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

export interface BranchItem {
  slNo: number;
  name: string;
}

export interface DepartmentOption {
  slNo: number;
  selected: boolean;
  name: string;
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

export interface UserRow {
  slNo: number;
  userName: string;
  userType: 'User' | 'Admin' | string;
  branch: string;
  phoneNo: string;
  hasDelete: boolean;
  hasEdit: boolean;
}

export interface DepartmentPermRow {
  slNo: number;
  branch: string;
  department: string;
  view: boolean;
  viewAll: boolean;
}

export interface MenuPermRow {
  slNo: number;
  menu: string;
  view: boolean;
  edit: boolean;
  delete: boolean;
  hasEdit?: boolean;
  hasDelete?: boolean;
}

export interface SettingItem {
  id: string;
  code: string;
  name: string;
  description?: string;
  status: 'Active' | 'Inactive';
}

export interface FollowupTypeItem {
  slNo: number;
  name: string;
}

export interface EnquirySourceItem {
  slNo: number;
  name: string;
}

export interface StatusItem {
  slNo: number;
  name: string;
}

export interface FeePendingItem {
  studentName: string;
  phoneNumber: string;
  informationStatus: 'Running' | 'Stopped' | string;
  balanceAmount: number;
  branch: string;
}

export interface CompanyInfo {
  companyName: string;
  phoneNo: string;
  email: string;
  address: string;
  landPhone: string;
  website: string;
}

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  // Current active branch
  private currentBranchSubject = new BehaviorSubject<string>('Ernakulam');
  currentBranch$ = this.currentBranchSubject.asObservable();

  // 1. Department Items (Settings Page)
  private departmentItems: DepartmentItem[] = [
    { slNo: 1, name: 'Accounts', followUp: 'yes', order: 1 },
    { slNo: 2, name: 'Admission', followUp: 'yes', order: 2 },
    { slNo: 3, name: 'CLOSED', followUp: 'no', order: 6 },
    { slNo: 4, name: 'Follow Up', followUp: 'yes', order: 3 },
    { slNo: 5, name: 'JOINED', followUp: 'no', order: 7 },
    { slNo: 6, name: 'Marketing', followUp: 'yes', order: 4 },
    { slNo: 7, name: 'Visa', followUp: 'yes', order: 5 }
  ];
  private departmentItems$ = new BehaviorSubject<DepartmentItem[]>(this.departmentItems);

  private deptStatusOptions: StatusOption[] = [
    { slNo: 1, selected: false, name: 'Interested' },
    { slNo: 2, selected: false, name: 'Not Interested' },
    { slNo: 3, selected: false, name: 'Payment Pending' },
    { slNo: 4, selected: false, name: 'Payment Received' },
    { slNo: 5, selected: false, name: 'Unknown' }
  ];
  private deptStatusOptions$ = new BehaviorSubject<StatusOption[]>(this.deptStatusOptions);

  // 2. Branch Items (Settings Page)
  private branchItems: BranchItem[] = [
    { slNo: 1, name: 'Ernakulam' },
    { slNo: 2, name: 'Kaloor' },
    { slNo: 3, name: 'Angamaly' },
    { slNo: 4, name: 'Thrikkakara' },
    { slNo: 5, name: 'Pala' },
    { slNo: 6, name: 'Naipunya Overseas' }
  ];
  private branchItems$ = new BehaviorSubject<BranchItem[]>(this.branchItems);

  private branchDeptOptions: DepartmentOption[] = [
    { slNo: 1, selected: false, name: 'Accounts' },
    { slNo: 2, selected: false, name: 'Admission' },
    { slNo: 3, selected: false, name: 'CLOSED' },
    { slNo: 4, selected: false, name: 'Follow Up' },
    { slNo: 5, selected: false, name: 'JOINED' },
    { slNo: 6, selected: false, name: 'Marketing' },
    { slNo: 7, selected: false, name: 'Visa' }
  ];
  private branchDeptOptions$ = new BehaviorSubject<DepartmentOption[]>(this.branchDeptOptions);

  // 3. Course Setup Items
  private courseItems: CourseItem[] = [
    { slNo: 1, name: 'A01 IELTS REGULAR', fees: 0, hasDelete: true, hasEdit: true },
    { slNo: 2, name: 'A02 IELTS 2 MONTHS', fees: 0, hasDelete: true, hasEdit: true },
    { slNo: 3, name: 'A03 IELTS CRASH', fees: 0, hasDelete: true, hasEdit: true },
    { slNo: 4, name: 'A04 IELTS Extn (ONE MONTH)', fees: 0, hasDelete: true, hasEdit: true },
    { slNo: 5, name: 'A05 IELTS Extn (2 WEEKS)', fees: 0, hasDelete: true, hasEdit: true },
    { slNo: 6, name: 'A06 OET', fees: 0, hasDelete: true, hasEdit: true },
    { slNo: 7, name: 'A07 COMMUNICATIVE ENGLISH 1 MONTH', fees: 0, hasDelete: true, hasEdit: true },
    { slNo: 8, name: 'A08 OET (2 Weeks)', fees: 0, hasDelete: true, hasEdit: true }
  ];
  private courseItems$ = new BehaviorSubject<CourseItem[]>(this.courseItems);

  private branchFees: CourseBranchFee[] = [
    { slNo: 1, branch: 'Ernakulam', fees: '' },
    { slNo: 2, branch: 'Kaloor', fees: '' },
    { slNo: 3, branch: 'Angamaly', fees: '' },
    { slNo: 4, branch: 'Thrikkakara', fees: '' },
    { slNo: 5, branch: 'Pala', fees: '' },
    { slNo: 6, branch: 'Naipunya Overseas', fees: '' }
  ];
  private branchFees$ = new BehaviorSubject<CourseBranchFee[]>(this.branchFees);

  // 4. Student List Records (Exact 15 rows from live Trackbox CRM)
  private studentListRows: StudentListRow[] = [
    {
      slNo: 1,
      name: 'JUSTIN K G',
      note: 'IELTS 1 MONTH',
      mobile: '9995914160',
      remark: 'IELTS 1 MONTH',
      nextFollowUp: '24-Nov-2026',
      department: 'Admission',
      status: 'Interested',
      to: 'DIVYA',
      from: 'DIVYA'
    },
    {
      slNo: 2,
      name: 'PRIYANKA CLEMENT',
      note: 'NICE',
      mobile: '8891460293',
      remark: 'NICE',
      nextFollowUp: '19-Nov-2026',
      department: 'Admission',
      status: 'Interested',
      to: 'DIVYA',
      from: 'DIVYA'
    },
    {
      slNo: 3,
      name: 'ROBBIN CHIRACKAL JOSEPH',
      note: 'IELTS 1 MONTH',
      mobile: '9895162325',
      remark: 'IELTS 1 MONTH',
      nextFollowUp: '19-Oct-2026',
      department: 'Admission',
      status: 'Interested',
      to: 'DIVYA',
      from: 'DIVYA'
    },
    {
      slNo: 4,
      name: 'ANJANA BINDHU',
      note: 'UK VISITING VISA',
      mobile: '9544669647',
      remark: 'UK VISITING VISA',
      nextFollowUp: '13-Oct-2026',
      department: 'Admission',
      status: 'Interested',
      to: 'DIVYA',
      from: 'DIVYA'
    },
    {
      slNo: 5,
      name: 'AWIN SANTHOSH',
      note: 'NZ DEPENDENT VISA',
      mobile: '9072933600',
      remark: 'NZ DEPENDENT VISA',
      nextFollowUp: '10-Oct-2026',
      department: 'Admission',
      status: 'Interested',
      to: 'DIVYA',
      from: 'DIVYA'
    },
    {
      slNo: 6,
      name: 'FR. BENNY VARGHESE THOPPIPARAMBIL',
      note: 'IELTS 1 MONTH',
      mobile: '7025714977',
      remark: 'IELTS 1 MONTH',
      nextFollowUp: '05-Oct-2026',
      department: 'Admission',
      status: 'Interested',
      to: 'DIVYA',
      from: 'DIVYA'
    },
    {
      slNo: 7,
      name: 'MIKAH SUBIN ARACKAL',
      note: 'UK DEPENDENT VISA',
      mobile: '8593956865',
      remark: 'UK DEPENDENT VISA',
      nextFollowUp: '14-Sep-2026',
      department: 'Admission',
      status: 'Interested',
      to: 'DIVYA',
      from: 'DIVYA'
    },
    {
      slNo: 8,
      name: 'MARIAN JOSEPH ARACKAL',
      note: 'IELTS 1 MONTH',
      mobile: '9447617828',
      remark: 'IELTS 1 MONTH',
      nextFollowUp: '07-Sep-2026',
      department: 'Admission',
      status: 'Interested',
      to: 'DIVYA',
      from: 'DIVYA'
    },
    {
      slNo: 9,
      name: 'EMMANUEL CHRISTIE BENHAR',
      note: 'IELTS 3 MONTHS',
      mobile: '9072070780',
      remark: 'IELTS 3 MONTHS',
      nextFollowUp: '31-Aug-2026',
      department: 'Admission',
      status: 'Interested',
      to: 'DIVYA',
      from: 'DIVYA'
    },
    {
      slNo: 10,
      name: 'LAKSHMI N BIJU',
      note: 'IELTS 1 MONTH EXTN',
      mobile: '8075863539',
      remark: 'IELTS 1 MONTH EXTN',
      nextFollowUp: '31-Aug-2026',
      department: 'Admission',
      status: 'Interested',
      to: 'DIVYA',
      from: 'DIVYA'
    },
    {
      slNo: 11,
      name: 'ALFIN SHINIL',
      note: 'IELTS 2 MONTH',
      mobile: '8330055882',
      remark: 'IELTS 2 MONTH',
      nextFollowUp: '31-Aug-2026',
      department: 'Admission',
      status: 'Interested',
      to: 'DIVYA',
      from: 'DIVYA'
    },
    {
      slNo: 12,
      name: 'MANUEL VATTISERRY VARGHESE',
      note: 'GERMANY',
      mobile: '6238209350',
      remark: 'GERMANY',
      nextFollowUp: '29-Aug-2026',
      department: 'Admission',
      status: 'Interested',
      to: 'DIVYA',
      from: 'DIVYA'
    },
    {
      slNo: 13,
      name: 'SHARON PUTHENPURAKKAL JOSEPH',
      note: 'GERMANY',
      mobile: '9037068928',
      remark: 'GERMANY',
      nextFollowUp: '17-Aug-2026',
      department: 'Admission',
      status: 'Interested',
      to: 'DIVYA',
      from: 'DIVYA'
    },
    {
      slNo: 14,
      name: 'Rahan Jude',
      note: 'IELTS 1 MONTH',
      mobile: '7994241436',
      remark: 'IELTS 1 MONTH',
      nextFollowUp: '17-Aug-2026',
      department: 'Admission',
      status: 'Interested',
      to: 'DIVYA',
      from: 'DIVYA'
    },
    {
      slNo: 15,
      name: 'AKHIL BABU',
      note: 'GERMANY',
      mobile: '7034653432',
      remark: 'GERMANY',
      nextFollowUp: '14-Aug-2026',
      department: 'Admission',
      status: 'Interested',
      to: 'DIVYA',
      from: 'DIVYA'
    }
  ];
  private studentListRows$ = new BehaviorSubject<StudentListRow[]>(this.studentListRows);

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
    { id: '2', receiptNo: '2', voucherNo: '2', date: '21-Nov-2026', from: 'ANANYA KRISHNAN', studentId: 'STU-1002', studentName: 'ANANYA KRISHNAN', course: 'OET', branch: 'Ernakulam', amount: 7500, paymentMode: 'UPI', toAccount: 'SBI Fee Collection', details: 'OET ADMISSION INSTALLMENT' },
    { id: '3', receiptNo: '3', voucherNo: '3', date: '17-Nov-2026', from: 'PRIYANKA CLEMENT', studentId: 'STU-1003', studentName: 'PRIYANKA CLEMENT', course: 'IELTS ACADEMIC', branch: 'Ernakulam', amount: 5000, paymentMode: 'Cash', toAccount: 'CASH IN HAND', details: 'IELTS COURSE FEE' },
    { id: '4', receiptNo: '4', voucherNo: '4', date: '15-Nov-2026', from: 'ARJUN MENON', studentId: 'STU-1004', studentName: 'ARJUN MENON', course: 'COMMUNICATIVE ENGLISH 1 MONTH', branch: 'Ernakulam', amount: 1500, paymentMode: 'UPI', toAccount: 'SBI Fee Collection', details: 'Book Amount' }
  ];
  private receipts$ = new BehaviorSubject<Receipt[]>(this.receipts);

  // 6b. Fees Pending Entries
  private feePendingEntries: FeePendingItem[] = [
    { studentName: 'Meera Nair', phoneNumber: '97450 61294', informationStatus: 'Running', balanceAmount: 10500.0, branch: 'Kochi Main' },
    { studentName: 'Arjun Raj', phoneNumber: '98462 33109', informationStatus: 'Running', balanceAmount: 16000.0, branch: 'Kochi Main' },
    { studentName: 'Nithya Menon', phoneNumber: '94471 02938', informationStatus: 'Stopped', balanceAmount: 12000.0, branch: 'Kochi Main' }
  ];
  private feePendingEntries$ = new BehaviorSubject<FeePendingItem[]>(this.feePendingEntries);

  // 7. Payments
  private payments: Payment[] = [
    { id: '1', voucherNo: 'VCH-2026-101', date: '2026-01-05', paidTo: 'Kerala State Electricity Board', category: 'Utilities', account: 'SBT Current A/C', branch: 'Ernakulam', amount: 8450, paymentMode: 'Bank Transfer', remarks: 'Dec electricity bill' },
    { id: '2', voucherNo: 'VCH-2026-102', date: '2026-01-12', paidTo: 'Asianet Broadband', category: 'Internet', account: 'Main Petty Cash', branch: 'Ernakulam', amount: 2400, paymentMode: 'Cash', remarks: 'Campus fiber connection' }
  ];
  private payments$ = new BehaviorSubject<Payment[]>(this.payments);

  // 8. Accounts
  private accounts: Account[] = [
    { id: '1', code: 'ACC-101', name: 'CASH IN HAND', details: 'Front-desk petty & fee cash', description: 'Front-desk petty cash and daily cash collection', type: 'Cash', branch: 'Ernakulam', openingBalance: 25000, currentBalance: 25000, status: 'Active' },
    { id: '2', code: 'ACC-102', name: 'HDFC Current Account', details: 'A/C •••• 4821 • Ravipuram', description: 'Main HDFC operating account', type: 'Bank', branch: 'Kaloor', openingBalance: 180000, currentBalance: 180000, status: 'Active' },
    { id: '3', code: 'ACC-103', name: 'SBI Fee Collection', details: 'A/C •••• 9104 • UPI Gateway', description: 'SBI UPI and online fee collection', type: 'Bank', branch: 'Ernakulam', openingBalance: 250000, currentBalance: 250000, status: 'Active' }
  ];
  private accounts$ = new BehaviorSubject<Account[]>(this.accounts);

  // 9. Users & Permissions (Users Table + 40 Dept Perms + 63 Menu Perms)
  private users: UserRow[] = [
    { slNo: 1, userName: 'AMALU', userType: 'User', branch: 'Thrikkakara', phoneNo: '', hasDelete: true, hasEdit: true },
    { slNo: 2, userName: 'ANNIE', userType: 'User', branch: 'Ernakulam', phoneNo: '', hasDelete: true, hasEdit: true },
    { slNo: 3, userName: 'Athul', userType: 'User', branch: 'Angamaly', phoneNo: '', hasDelete: true, hasEdit: true },
    { slNo: 4, userName: 'Binijose', userType: 'User', branch: 'Ernakulam', phoneNo: '', hasDelete: true, hasEdit: true },
    { slNo: 5, userName: 'DIRECTOR', userType: 'Admin', branch: 'Ernakulam', phoneNo: '', hasDelete: true, hasEdit: true },
    { slNo: 6, userName: 'DIVYA', userType: 'User', branch: 'Ernakulam', phoneNo: '', hasDelete: true, hasEdit: true },
    { slNo: 7, userName: 'DRSAJITHA', userType: 'User', branch: 'Ernakulam', phoneNo: '', hasDelete: true, hasEdit: true },
    { slNo: 8, userName: 'Febi2020', userType: 'User', branch: 'Ernakulam', phoneNo: '', hasDelete: true, hasEdit: true },
    { slNo: 9, userName: 'Feby', userType: 'User', branch: 'Ernakulam', phoneNo: '', hasDelete: true, hasEdit: true },
    { slNo: 10, userName: 'FEBY18', userType: 'User', branch: 'Ernakulam', phoneNo: '', hasDelete: true, hasEdit: true },
    { slNo: 11, userName: 'Frjophy', userType: 'Admin', branch: 'Thrikkakara', phoneNo: '', hasDelete: true, hasEdit: true },
    { slNo: 12, userName: 'Froly', userType: 'User', branch: 'Ernakulam', phoneNo: '', hasDelete: true, hasEdit: true },
    { slNo: 13, userName: 'Froly2020', userType: 'User', branch: 'Ernakulam', phoneNo: '', hasDelete: true, hasEdit: true },
    { slNo: 14, userName: 'Frsebanp', userType: 'Admin', branch: 'Angamaly', phoneNo: '', hasDelete: true, hasEdit: true },
    { slNo: 15, userName: 'Frshijo', userType: 'Admin', branch: 'Kaloor', phoneNo: '', hasDelete: true, hasEdit: true }
  ];
  private users$ = new BehaviorSubject<UserRow[]>(this.users);

  private departmentPerms: DepartmentPermRow[] = [
    // Angamaly (1-7)
    { slNo: 1, branch: 'Angamaly', department: 'Admission', view: false, viewAll: false },
    { slNo: 2, branch: '', department: 'Accounts', view: false, viewAll: false },
    { slNo: 3, branch: '', department: 'CLOSED', view: false, viewAll: false },
    { slNo: 4, branch: '', department: 'Marketing', view: false, viewAll: false },
    { slNo: 5, branch: '', department: 'Follow Up', view: false, viewAll: false },
    { slNo: 6, branch: '', department: 'JOINED', view: false, viewAll: false },
    { slNo: 7, branch: '', department: 'Visa', view: false, viewAll: false },
    // Ernakulam (8-14)
    { slNo: 8, branch: 'Ernakulam', department: 'Admission', view: false, viewAll: false },
    { slNo: 9, branch: '', department: 'Accounts', view: false, viewAll: false },
    { slNo: 10, branch: '', department: 'CLOSED', view: false, viewAll: false },
    { slNo: 11, branch: '', department: 'Marketing', view: false, viewAll: false },
    { slNo: 12, branch: '', department: 'Follow Up', view: false, viewAll: false },
    { slNo: 13, branch: '', department: 'JOINED', view: false, viewAll: false },
    { slNo: 14, branch: '', department: 'Visa', view: false, viewAll: false },
    // Kaloor (15-21)
    { slNo: 15, branch: 'Kaloor', department: 'Admission', view: false, viewAll: false },
    { slNo: 16, branch: '', department: 'Accounts', view: false, viewAll: false },
    { slNo: 17, branch: '', department: 'CLOSED', view: false, viewAll: false },
    { slNo: 18, branch: '', department: 'Marketing', view: false, viewAll: false },
    { slNo: 19, branch: '', department: 'Follow Up', view: false, viewAll: false },
    { slNo: 20, branch: '', department: 'JOINED', view: false, viewAll: false },
    { slNo: 21, branch: '', department: 'Visa', view: false, viewAll: false },
    // Naipunya Overseas (22-28)
    { slNo: 22, branch: 'Naipunya Overseas', department: 'Admission', view: false, viewAll: false },
    { slNo: 23, branch: '', department: 'Accounts', view: false, viewAll: false },
    { slNo: 24, branch: '', department: 'CLOSED', view: false, viewAll: false },
    { slNo: 25, branch: '', department: 'Marketing', view: false, viewAll: false },
    { slNo: 26, branch: '', department: 'Follow Up', view: false, viewAll: false },
    { slNo: 27, branch: '', department: 'JOINED', view: false, viewAll: false },
    { slNo: 28, branch: '', department: 'Visa', view: false, viewAll: false },
    // Pala (29-34)
    { slNo: 29, branch: 'Pala', department: 'Admission', view: false, viewAll: false },
    { slNo: 30, branch: '', department: 'Accounts', view: false, viewAll: false },
    { slNo: 31, branch: '', department: 'CLOSED', view: false, viewAll: false },
    { slNo: 32, branch: '', department: 'Marketing', view: false, viewAll: false },
    { slNo: 33, branch: '', department: 'Follow Up', view: false, viewAll: false },
    { slNo: 34, branch: '', department: 'JOINED', view: false, viewAll: false },
    // Thrikkakara (35-40)
    { slNo: 35, branch: 'Thrikkakara', department: 'Admission', view: false, viewAll: false },
    { slNo: 36, branch: '', department: 'Accounts', view: false, viewAll: false },
    { slNo: 37, branch: '', department: 'Follow Up', view: false, viewAll: false },
    { slNo: 38, branch: '', department: 'JOINED', view: false, viewAll: false },
    { slNo: 39, branch: '', department: 'Marketing', view: false, viewAll: false },
    { slNo: 40, branch: '', department: 'Visa', view: false, viewAll: false }
  ];
  private departmentPerms$ = new BehaviorSubject<DepartmentPermRow[]>(this.departmentPerms);

  private menuPerms: MenuPermRow[] = [
    { slNo: 1, menu: 'Create New', view: false, edit: false, delete: false, hasDelete: true },
    { slNo: 2, menu: 'Tab-Qualification', view: false, edit: false, delete: false },
    { slNo: 3, menu: 'Tab-Course', view: false, edit: false, delete: false },
    { slNo: 4, menu: 'Tab-Application', view: false, edit: false, delete: false },
    { slNo: 5, menu: 'Tab-Fund Details', view: false, edit: false, delete: false },
    { slNo: 6, menu: 'Tab-Invoice Details', view: false, edit: false, delete: false },
    { slNo: 7, menu: 'Tab-Checklist', view: false, edit: false, delete: false },
    { slNo: 8, menu: 'Tab-Document', view: false, edit: false, delete: false },
    { slNo: 9, menu: 'Student List', view: false, edit: false, delete: false },
    { slNo: 10, menu: 'Task', view: false, edit: false, delete: false, hasEdit: true, hasDelete: true },
    { slNo: 11, menu: 'Report', view: false, edit: false, delete: false },
    { slNo: 12, menu: 'User Activity Report', view: false, edit: false, delete: false },
    { slNo: 13, menu: 'Work Report', view: false, edit: false, delete: false },
    { slNo: 14, menu: 'FollowUp Summary', view: false, edit: false, delete: false },
    { slNo: 15, menu: 'Enquiry Source Report', view: false, edit: false, delete: false },
    { slNo: 16, menu: 'Task Report', view: false, edit: false, delete: false },
    { slNo: 17, menu: 'Fee Payment Report', view: false, edit: false, delete: false },
    { slNo: 18, menu: 'Application Status Report', view: false, edit: false, delete: false },
    { slNo: 19, menu: 'Application Details Status Report', view: false, edit: false, delete: false },
    { slNo: 20, menu: 'Student Report', view: false, edit: false, delete: false },
    { slNo: 21, menu: 'Login Report', view: false, edit: false, delete: false },
    { slNo: 22, menu: 'PCC Report', view: false, edit: false, delete: false },
    { slNo: 23, menu: 'Medical Report', view: false, edit: false, delete: false },
    { slNo: 24, menu: 'Checklist Report', view: false, edit: false, delete: false },
    { slNo: 25, menu: 'Invoice Claim Report', view: false, edit: false, delete: false },
    { slNo: 26, menu: 'Fees Pending Report', view: false, edit: false, delete: false },
    { slNo: 27, menu: 'Ielts Students Report', view: false, edit: false, delete: false },
    { slNo: 28, menu: 'Student Registration Report', view: false, edit: false, delete: false },
    { slNo: 29, menu: 'Data', view: false, edit: false, delete: false },
    { slNo: 30, menu: 'Import', view: false, edit: false, delete: false },
    { slNo: 31, menu: 'Import Pool', view: false, edit: false, delete: false },
    { slNo: 32, menu: 'FileTransfer', view: false, edit: false, delete: false },
    { slNo: 33, menu: 'Settings', view: false, edit: false, delete: false },
    { slNo: 34, menu: 'Course', view: false, edit: false, delete: false, hasEdit: true, hasDelete: true },
    { slNo: 35, menu: 'Overseas Course', view: false, edit: false, delete: false, hasEdit: true, hasDelete: true },
    { slNo: 36, menu: 'User Details', view: false, edit: false, delete: false, hasEdit: true, hasDelete: true },
    { slNo: 37, menu: 'Enquiry Source', view: false, edit: false, delete: false, hasEdit: true, hasDelete: true },
    { slNo: 38, menu: 'Status', view: false, edit: false, delete: false, hasEdit: true, hasDelete: true },
    { slNo: 39, menu: 'Stream', view: false, edit: false, delete: false, hasEdit: true, hasDelete: true },
    { slNo: 40, menu: 'FollowUp Type', view: false, edit: false, delete: false, hasEdit: true, hasDelete: true },
    { slNo: 41, menu: 'Country', view: false, edit: false, delete: false, hasEdit: true, hasDelete: true },
    { slNo: 42, menu: 'Level', view: false, edit: false, delete: false, hasEdit: true, hasDelete: true },
    { slNo: 43, menu: 'College', view: false, edit: false, delete: false, hasEdit: true, hasDelete: true },
    { slNo: 44, menu: 'Department', view: false, edit: false, delete: false, hasEdit: true, hasDelete: true },
    { slNo: 45, menu: 'Branch', view: false, edit: false, delete: false, hasEdit: true, hasDelete: true },
    { slNo: 46, menu: 'Checklist Item', view: false, edit: false, delete: false, hasEdit: true, hasDelete: true },
    { slNo: 47, menu: 'Document', view: false, edit: false, delete: false, hasEdit: true, hasDelete: true },
    { slNo: 48, menu: 'User Role', view: false, edit: false, delete: false, hasEdit: true, hasDelete: true },
    { slNo: 49, menu: 'Intake', view: false, edit: false, delete: false, hasEdit: true, hasDelete: true },
    { slNo: 50, menu: 'Place', view: false, edit: false, delete: false, hasEdit: true, hasDelete: true },
    { slNo: 51, menu: 'Company Info', view: false, edit: false, delete: false },
    { slNo: 52, menu: 'Export', view: false, edit: false, delete: false },
    { slNo: 53, menu: 'Register', view: false, edit: false, delete: false },
    { slNo: 54, menu: 'Remove Registration', view: false, edit: false, delete: false },
    { slNo: 55, menu: 'Course Discount', view: false, edit: false, delete: false },
    { slNo: 56, menu: 'Generate Button', view: false, edit: false, delete: false },
    { slNo: 57, menu: 'Receipt Delete', view: false, edit: false, delete: false },
    { slNo: 58, menu: 'Account', view: false, edit: false, delete: false },
    { slNo: 59, menu: 'Receipt', view: false, edit: false, delete: false, hasEdit: true, hasDelete: true },
    { slNo: 60, menu: 'Accounts', view: false, edit: false, delete: false },
    { slNo: 61, menu: 'Payment', view: false, edit: false, delete: false, hasEdit: true, hasDelete: true },
    { slNo: 62, menu: 'Branch Account Report', view: false, edit: false, delete: false },
    { slNo: 63, menu: 'Search All', view: false, edit: false, delete: false }
  ];
  private menuPerms$ = new BehaviorSubject<MenuPermRow[]>(this.menuPerms);

  // 10. Settings (Follow-up Types, Enquiry Sources, Statuses)
  private followupTypeItems: FollowupTypeItem[] = [
    { slNo: 1, name: 'e-mail' },
    { slNo: 2, name: 'Incoming Call' },
    { slNo: 3, name: 'Outgoing Call' },
    { slNo: 4, name: 'Walkin' }
  ];
  private followupTypeItems$ = new BehaviorSubject<FollowupTypeItem[]>(this.followupTypeItems);

  private enquirySourceItems: EnquirySourceItem[] = [
    { slNo: 1, name: 'Advertisement' },
    { slNo: 2, name: 'Angamaly ref' },
    { slNo: 3, name: 'Ernakulam ref' },
    { slNo: 4, name: 'From Database' },
    { slNo: 5, name: 'google' },
    { slNo: 6, name: 'Kaloor ref' },
    { slNo: 7, name: 'Pala ref' },
    { slNo: 8, name: 'Phone' },
    { slNo: 9, name: 'Thrikkakara ref' },
    { slNo: 10, name: 'Walkin' },
    { slNo: 11, name: 'Website' }
  ];
  private enquirySourceItems$ = new BehaviorSubject<EnquirySourceItem[]>(this.enquirySourceItems);

  private statusSettingsItems: StatusItem[] = [
    { slNo: 1, name: 'Interested' },
    { slNo: 2, name: 'Not Interested' },
    { slNo: 3, name: 'Payment Pending' },
    { slNo: 4, name: 'Payment Received' },
    { slNo: 5, name: 'Unknown' }
  ];
  private statusSettingsItems$ = new BehaviorSubject<StatusItem[]>(this.statusSettingsItems);

  // 11. Company Information
  private companyInfo: CompanyInfo = {
    companyName: 'Naipunya Academy of Languages & Skills',
    phoneNo: '98470 22001',
    email: 'info@naipunya.edu.in',
    address: 'MG Road, Ravipuram, Ernakulam, Kochi, Kerala 682016',
    landPhone: '0484 235 8890',
    website: 'https://naipunya.edu.in'
  };
  private companyInfo$ = new BehaviorSubject<CompanyInfo>(this.companyInfo);

  // Observables
  getDepartmentItems(): Observable<DepartmentItem[]> { return this.departmentItems$.asObservable(); }
  getDeptStatusOptions(): Observable<StatusOption[]> { return this.deptStatusOptions$.asObservable(); }
  getBranchItems(): Observable<BranchItem[]> { return this.branchItems$.asObservable(); }
  getBranchDeptOptions(): Observable<DepartmentOption[]> { return this.branchDeptOptions$.asObservable(); }
  getCourseItems(): Observable<CourseItem[]> { return this.courseItems$.asObservable(); }
  getBranchFees(): Observable<CourseBranchFee[]> { return this.branchFees$.asObservable(); }
  getStudentListRows(): Observable<StudentListRow[]> { return this.studentListRows$.asObservable(); }
  getUserRows(): Observable<UserRow[]> { return this.users$.asObservable(); }
  getDepartmentPerms(): Observable<DepartmentPermRow[]> { return this.departmentPerms$.asObservable(); }
  getMenuPerms(): Observable<MenuPermRow[]> { return this.menuPerms$.asObservable(); }
  getFollowupTypeItems(): Observable<FollowupTypeItem[]> { return this.followupTypeItems$.asObservable(); }
  getEnquirySourceItems(): Observable<EnquirySourceItem[]> { return this.enquirySourceItems$.asObservable(); }
  getStatusSettingsItems(): Observable<StatusItem[]> { return this.statusSettingsItems$.asObservable(); }
  getCompanyInfo(): Observable<CompanyInfo> { return this.companyInfo$.asObservable(); }
  getFollowUps(): Observable<StudentFollowUp[]> { return this.followUps$.asObservable(); }
  getReceipts(): Observable<Receipt[]> { return this.receipts$.asObservable(); }
  getFeePendingEntries(): Observable<FeePendingItem[]> { return this.feePendingEntries$.asObservable(); }
  getPayments(): Observable<Payment[]> { return this.payments$.asObservable(); }
  getAccounts(): Observable<Account[]> { return this.accounts$.asObservable(); }

  getBranches(): Observable<Branch[]> {
    return of(this.branchItems.map(b => ({
      id: String(b.slNo),
      code: `BR-${b.name.substring(0, 3).toUpperCase()}`,
      name: b.name,
      city: b.name,
      phone: '0484 235 8890',
      address: 'Main Campus',
      status: 'Active' as const
    })));
  }

  getStudents(): Observable<Student[]> {
    return of(this.studentListRows.map(s => ({
      id: String(s.slNo),
      code: `STU-${1000 + s.slNo}`,
      name: s.name,
      phone: s.mobile,
      email: `${s.name.toLowerCase().replace(/[^a-z]/g, '')}@example.com`,
      course: s.note || 'IELTS',
      branch: 'Ernakulam',
      department: s.department || 'Admission',
      batch: '2026-Batch A',
      admissionDate: '2026-01-10',
      feesTotal: 45000,
      feesPaid: 25000,
      status: 'Active' as const
    })));
  }

  addStudent(student: any) {
    this.addStudentListRow({
      name: student.name || 'New Student',
      mobile: student.phone || '',
      note: student.course || '',
      remark: student.course || '',
      nextFollowUp: '25-Nov-2026',
      department: student.department || 'Admission',
      status: 'Interested',
      to: 'DIVYA',
      from: 'DIVYA',
      branch: student.branch || 'Ernakulam'
    });
  }

  getFollowupTypes(): Observable<SettingItem[]> {
    return of(this.followupTypeItems.map(f => ({
      id: String(f.slNo),
      code: `FT-0${f.slNo}`,
      name: f.name,
      status: 'Active' as const
    })));
  }

  getEnquirySources(): Observable<SettingItem[]> {
    return of(this.enquirySourceItems.map(e => ({
      id: String(e.slNo),
      code: `SRC-0${e.slNo}`,
      name: e.name,
      status: 'Active' as const
    })));
  }

  setBranch(branch: string) {
    this.currentBranchSubject.next(branch);
  }

  // --- Department CRUD ---
  addDepartmentItem(item: Omit<DepartmentItem, 'slNo'>) {
    const newItem: DepartmentItem = { ...item, slNo: this.departmentItems.length + 1 };
    this.departmentItems = [...this.departmentItems, newItem];
    this.departmentItems$.next([...this.departmentItems]);
  }

  updateDepartmentItem(slNo: number, updated: Partial<DepartmentItem>) {
    this.departmentItems = this.departmentItems.map(d => d.slNo === slNo ? { ...d, ...updated } : d);
    this.departmentItems$.next([...this.departmentItems]);
  }

  deleteDepartmentItem(slNo: number) {
    this.departmentItems = this.departmentItems.filter(d => d.slNo !== slNo);
    this.departmentItems.forEach((d, idx) => d.slNo = idx + 1);
    this.departmentItems$.next([...this.departmentItems]);
  }

  // --- Branch CRUD ---
  addBranchItem(item: Omit<BranchItem, 'slNo'>) {
    const newItem: BranchItem = { ...item, slNo: this.branchItems.length + 1 };
    this.branchItems = [...this.branchItems, newItem];
    this.branchItems$.next([...this.branchItems]);
  }

  updateBranchItem(slNo: number, updated: Partial<BranchItem>) {
    this.branchItems = this.branchItems.map(b => b.slNo === slNo ? { ...b, ...updated } : b);
    this.branchItems$.next([...this.branchItems]);
  }

  deleteBranchItem(slNo: number) {
    this.branchItems = this.branchItems.filter(b => b.slNo !== slNo);
    this.branchItems.forEach((b, idx) => b.slNo = idx + 1);
    this.branchItems$.next([...this.branchItems]);
  }

  // --- Course CRUD ---
  addCourseItem(item: Omit<CourseItem, 'slNo'>) {
    const newItem: CourseItem = { ...item, slNo: this.courseItems.length + 1 };
    this.courseItems = [...this.courseItems, newItem];
    this.courseItems$.next([...this.courseItems]);
  }

  updateCourseItem(slNo: number, updated: Partial<CourseItem>) {
    this.courseItems = this.courseItems.map(c => c.slNo === slNo ? { ...c, ...updated } : c);
    this.courseItems$.next([...this.courseItems]);
  }

  deleteCourseItem(slNo: number) {
    this.courseItems = this.courseItems.filter(c => c.slNo !== slNo);
    this.courseItems.forEach((c, idx) => c.slNo = idx + 1);
    this.courseItems$.next([...this.courseItems]);
  }

  // --- Student List CRUD ---
  addStudentListRow(row: Omit<StudentListRow, 'slNo'>) {
    const newRow: StudentListRow = { ...row, slNo: this.studentListRows.length + 1 };
    this.studentListRows = [newRow, ...this.studentListRows];
    this.studentListRows$.next([...this.studentListRows]);
  }

  updateStudentListRow(slNo: number, updated: Partial<StudentListRow>) {
    this.studentListRows = this.studentListRows.map(s => s.slNo === slNo ? { ...s, ...updated } : s);
    this.studentListRows$.next([...this.studentListRows]);
  }

  deleteStudentListRow(slNo: number) {
    this.studentListRows = this.studentListRows.filter(s => s.slNo !== slNo);
    this.studentListRows.forEach((s, idx) => s.slNo = idx + 1);
    this.studentListRows$.next([...this.studentListRows]);
  }

  // --- Users CRUD ---
  addUserRow(user: Omit<UserRow, 'slNo'>) {
    const newUser: UserRow = { ...user, slNo: this.users.length + 1 };
    this.users = [...this.users, newUser];
    this.users$.next([...this.users]);
  }

  deleteUserRow(slNo: number) {
    this.users = this.users.filter(u => u.slNo !== slNo);
    this.users.forEach((u, idx) => u.slNo = idx + 1);
    this.users$.next([...this.users]);
  }

  // --- Follow-up Types CRUD ---
  addFollowupTypeItem(name: string) {
    const newItem: FollowupTypeItem = { slNo: this.followupTypeItems.length + 1, name };
    this.followupTypeItems = [...this.followupTypeItems, newItem];
    this.followupTypeItems$.next([...this.followupTypeItems]);
  }

  updateFollowupTypeItem(slNo: number, name: string) {
    this.followupTypeItems = this.followupTypeItems.map(i => i.slNo === slNo ? { ...i, name } : i);
    this.followupTypeItems$.next([...this.followupTypeItems]);
  }

  deleteFollowupTypeItem(slNo: number) {
    this.followupTypeItems = this.followupTypeItems.filter(i => i.slNo !== slNo);
    this.followupTypeItems.forEach((i, idx) => i.slNo = idx + 1);
    this.followupTypeItems$.next([...this.followupTypeItems]);
  }

  // --- Enquiry Sources CRUD ---
  addEnquirySourceItem(name: string) {
    const newItem: EnquirySourceItem = { slNo: this.enquirySourceItems.length + 1, name };
    this.enquirySourceItems = [...this.enquirySourceItems, newItem];
    this.enquirySourceItems$.next([...this.enquirySourceItems]);
  }

  updateEnquirySourceItem(slNo: number, name: string) {
    this.enquirySourceItems = this.enquirySourceItems.map(i => i.slNo === slNo ? { ...i, name } : i);
    this.enquirySourceItems$.next([...this.enquirySourceItems]);
  }

  deleteEnquirySourceItem(slNo: number) {
    this.enquirySourceItems = this.enquirySourceItems.filter(i => i.slNo !== slNo);
    this.enquirySourceItems.forEach((i, idx) => i.slNo = idx + 1);
    this.enquirySourceItems$.next([...this.enquirySourceItems]);
  }

  // --- Status Settings CRUD ---
  addStatusSettingsItem(name: string) {
    const newItem: StatusItem = { slNo: this.statusSettingsItems.length + 1, name };
    this.statusSettingsItems = [...this.statusSettingsItems, newItem];
    this.statusSettingsItems$.next([...this.statusSettingsItems]);
  }

  updateStatusSettingsItem(slNo: number, name: string) {
    this.statusSettingsItems = this.statusSettingsItems.map(i => i.slNo === slNo ? { ...i, name } : i);
    this.statusSettingsItems$.next([...this.statusSettingsItems]);
  }

  deleteStatusSettingsItem(slNo: number) {
    this.statusSettingsItems = this.statusSettingsItems.filter(i => i.slNo !== slNo);
    this.statusSettingsItems.forEach((i, idx) => i.slNo = idx + 1);
    this.statusSettingsItems$.next([...this.statusSettingsItems]);
  }

  // --- Company Info Update ---
  updateCompanyInfo(info: CompanyInfo) {
    this.companyInfo = { ...info };
    this.companyInfo$.next({ ...this.companyInfo });
  }

  // --- Accounts CRUD ---
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

  // --- Receipt CRUD ---
  addReceipt(receipt: Omit<Receipt, 'id' | 'receiptNo'>): Receipt {
    const newReceipt: Receipt = {
      ...receipt,
      id: String(Date.now()),
      receiptNo: `RCP-2026-${String(this.receipts.length + 1).padStart(3, '0')}`
    };
    this.receipts = [newReceipt, ...this.receipts];
    this.receipts$.next([...this.receipts]);
    return newReceipt;
  }

  deleteReceipt(id: string) {
    this.receipts = this.receipts.filter(r => r.id !== id);
    this.receipts$.next([...this.receipts]);
  }

  // --- FollowUp CRUD ---
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
}
