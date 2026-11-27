import { ApplicationRef, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin, of } from 'rxjs';
import { catchError, finalize, filter, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { NotificationService } from './notification.service';

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
  status: string;
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
  department: string;
  duration: string;
  fees: number;
  status: string;
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

export interface RoleRow {
  slNo: number;
  role: string;
  under: string;
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
@Injectable({ providedIn: 'root' })
export class DataService {
  private currentBranchSubject = new BehaviorSubject<string>('');
  currentBranch$ = this.currentBranchSubject.asObservable();

  private branchesCache: any[] = [];
  private branches$ = new BehaviorSubject<Branch[]>([]);

  private departmentItems$ = new BehaviorSubject<DepartmentItem[]>([]);
  private deptStatusOptions$ = new BehaviorSubject<StatusOption[]>([]);
  private branchItems$ = new BehaviorSubject<BranchItem[]>([]);
  private branchDeptOptions$ = new BehaviorSubject<DepartmentOption[]>([]);
  private courseItems$ = new BehaviorSubject<CourseItem[]>([]);
  private branchFees$ = new BehaviorSubject<CourseBranchFee[]>([]);
  private studentListRows$ = new BehaviorSubject<StudentListRow[]>([]);
  private students$ = new BehaviorSubject<Student[]>([]);
  private users$ = new BehaviorSubject<UserRow[]>([]);

  private loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loadingSubject.asObservable();
  private loadedKeys = new Set<string>();
  private inFlight = new Map<string, Observable<void>>();
  private preload$: Observable<void> | null = null;
  private departmentPerms$ = new BehaviorSubject<DepartmentPermRow[]>([]);
  private menuPerms$ = new BehaviorSubject<MenuPermRow[]>([]);
  private followupTypeItems$ = new BehaviorSubject<FollowupTypeItem[]>([]);
  private enquirySourceItems$ = new BehaviorSubject<EnquirySourceItem[]>([]);
  private statusSettingsItems$ = new BehaviorSubject<StatusItem[]>([]);
  private companyInfo$ = new BehaviorSubject<CompanyInfo>({
    companyName: '', phoneNo: '', email: '', address: '', landPhone: '', website: ''
  });
  private followUps$ = new BehaviorSubject<StudentFollowUp[]>([]);
  private receipts$ = new BehaviorSubject<Receipt[]>([]);
  private feePendingEntries$ = new BehaviorSubject<FeePendingItem[]>([]);
  private payments$ = new BehaviorSubject<Payment[]>([]);
  private accounts$ = new BehaviorSubject<Account[]>([]);
  private roles$ = new BehaviorSubject<RoleRow[]>([]);


  constructor(private api: ApiService, private appRef: ApplicationRef, private notify: NotificationService) {}

  // ---------- helpers ----------
  private unwrap(res: any): any[] {
    if (Array.isArray(res?.data)) return res.data;
    if (res?.data) return [res.data];
    return [];
  }

  private fmtDate(value: any): string {
    if (!value) return '';
    const d = new Date(value);
    if (isNaN(d.getTime())) return String(value);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${String(d.getDate()).padStart(2, '0')}-${months[d.getMonth()]}-${d.getFullYear()}`;
  }

  private branchName(id: any): string {
    const found = this.branchesCache.find(b => Number(b.id) === Number(id));
    return found ? found.name : '';
  }

  // One HTTP request per data set, shared by every subscriber.
  private ensureLoaded(key: string, source: Observable<any>, apply: (res: any) => void, force = false): Observable<void> {
    const pending = this.inFlight.get(key);
    if (pending) return pending;
    if (!force && this.loadedKeys.has(key)) return of(void 0);

    const request$ = source.pipe(
      tap((res: any) => {
        this.loadedKeys.add(key);
        apply(res);
        queueMicrotask(() => this.appRef.tick());
      }),
      catchError(err => {
        console.error(`[ApiService] ${key} failed:`, err?.message || err);
        this.loadedKeys.add(key);
        return of(void 0);
      }),
      finalize(() => this.inFlight.delete(key)),
      shareReplay(1)
    );
    this.inFlight.set(key, request$);
    return request$ as Observable<void>;
  }

  // Do not emit the initial empty BehaviorSubject value before data arrives.
  private ready<T>(key: string, source: Observable<T>): Observable<T> {
    return source.pipe(filter(() => this.loadedKeys.has(key)));
  }

  private cached<T>(key: string, load: () => Observable<void>, subject: BehaviorSubject<T>): Observable<T> {
    load().subscribe();
    return this.ready(key, subject.asObservable());
  }

  reset(): void {
    this.loadedKeys.clear();
    this.inFlight.clear();
    this.preload$ = null;
    this.loadingSubject.next(false);
  }

  // Loaded once after login and on refresh, so pages never render empty placeholders first.
  preload(): Observable<void> {
    if (this.preload$) return this.preload$;
    this.loadingSubject.next(true);

    // Start every data set together; each loader already waits for its own
    // dependencies, and ensureLoaded() shares duplicate requests.
    this.preload$ = forkJoin([
      this.loadBranches(),
      this.loadDepartments(),
      this.loadStatus(),
      this.loadCourses(),
      this.loadStudentData(),
      this.loadAccounts(),
      this.loadReceipts(),
      this.loadPayments(),
      this.loadFeePending(),
      this.loadFollowUps(),
      this.loadUsers(),
      this.loadRoles(),
      this.loadFollowupTypes(),
      this.loadEnquirySources(),
      this.loadCompanyInfo(),
      this.loadDepartmentPerms(),
      this.loadMenuPerms()
    ]).pipe(
      map(() => void 0),
      finalize(() => this.loadingSubject.next(false)),
      shareReplay(1)
    );
    return this.preload$;
  }

  private loadBranches(force = false): Observable<void> {
    return this.ensureLoaded('branches', this.api.getBranches(), res => {
      const rows = this.unwrap(res);
      this.branchesCache = rows;
      this.branches$.next(rows.map((b, i) => ({
        id: String(b.id || i + 1), code: b.code || '', name: b.name || '', city: b.city || '',
        phone: b.phone || '', address: b.address || '', status: b.status || 'Active'
      })));
      this.branchItems$.next(rows.map((b, i) => ({ slNo: Number(b.id) || i + 1, name: b.name })));
      this.branchFees$.next(rows.map((b, i) => ({ slNo: i + 1, branch: b.name, fees: '' })));
    }, force);
  }

  private loadDepartments(force = false): Observable<void> {
    return this.ensureLoaded('departments', this.api.getDepartments(), res => {
      const rows = this.unwrap(res);
      this.departmentNameById = {};
      this.departmentIdByName = {};
      rows.forEach(d => {
        const id = Number(d.id);
        this.departmentNameById[id] = d.name;
        this.departmentIdByName[d.name] = id;
      });
      this.departmentItems$.next(rows.map((d, i) => ({
        slNo: Number(d.id) || i + 1, name: d.name, followUp: 'yes', order: Number(d.id) || i + 1
      })));
      this.branchDeptOptions$.next(rows.map((d, i) => ({
        slNo: Number(d.id) || i + 1, selected: false, name: d.name
      })));
    }, force);
  }

  private departmentNameById: { [id: number]: string } = {};
  private departmentIdByName: { [name: string]: number } = {};

  private loadStatus(force = false): Observable<void> {
    return this.ensureLoaded('settings:status', this.api.getSettings('status'), res => {
      const rows = this.unwrap(res);
      this.deptStatusOptions$.next(rows.map((s, i) => ({
        slNo: Number(s.id) || i + 1, selected: false, name: s.name
      })));
      this.statusSettingsItems$.next(rows.map((s, i) => ({
        slNo: Number(s.id) || i + 1, name: s.name
      })));
    }, force);
  }

  private loadSetting(type: string, key: string, subject: BehaviorSubject<any>, mapper: (s: any, i: number) => any, force = false): Observable<void> {
    return this.ensureLoaded(key, this.api.getSettings(type), res => {
      subject.next(this.unwrap(res).map(mapper));
    }, force);
  }

  private loadFollowupTypes(force = false): Observable<void> {
    return this.loadSetting('followup_type', 'settings:followup_type', this.followupTypeItems$,
      (s, i) => ({ slNo: Number(s.id) || i + 1, name: s.name }), force);
  }

  private loadEnquirySources(force = false): Observable<void> {
    return this.loadSetting('enquiry_source', 'settings:enquiry_source', this.enquirySourceItems$,
      (s, i) => ({ slNo: Number(s.id) || i + 1, name: s.name }), force);
  }

  private loadCourses(force = false): Observable<void> {
    return this.loadDepartments().pipe(switchMap(() => this.ensureLoaded('courses', this.api.getCourses(), res => {
      this.courseItems$.next(this.unwrap(res).map((c, i) => ({
        slNo: Number(c.id) || i + 1,
        name: c.name || '',
        department: this.departmentNameById[c.department_id] || '',
        duration: c.duration || '',
        fees: Number(c.fee) || 0,
        status: c.status || 'Active',
        hasDelete: true, hasEdit: true
      })));
    }, force)));
  }

  private mapStudentListRows(rows: any[]): StudentListRow[] {
    return rows.map((s, i) => ({
      slNo: Number(s.id) || i + 1,
      name: s.name || '',
      note: s.course_name || '',
      mobile: s.phone || '',
      remark: s.course_name || '',
      nextFollowUp: this.fmtDate(s.admission_date),
      department: s.department_name || '',
      status: s.status || '',
      to: '',
      from: '',
      branch: s.branch_name || ''
    }));
  }

  private mapStudentRows(rows: any[]): Student[] {
    return rows.map((s: any, i: number) => ({
      id: String(s.id || i + 1),
      code: s.student_code || '',
      name: s.name || '',
      phone: s.phone || '',
      email: s.email || '',
      course: s.course_name || '',
      branch: s.branch_name || '',
      department: s.department_name || '',
      batch: s.batch || '',
      admissionDate: s.admission_date || '',
      feesTotal: Number(s.fees_total) || 0,
      feesPaid: Number(s.fees_paid) || 0,
      status: s.status || 'Active'
    }));
  }

  private loadStudentData(force = false): Observable<void> {
    return this.ensureLoaded('students', this.api.getStudents({ limit: 100 }), res => {
      const rows = this.unwrap(res);
      this.studentListRows$.next(this.mapStudentListRows(rows));
      this.students$.next(this.mapStudentRows(rows));
    }, force);
  }

  loadStudents(): Observable<StudentListRow[]> {
    return this.cached('students', () => this.loadStudentData(), this.studentListRows$);
  }

  fetchStudents(): Observable<StudentListRow[]> {
    return this.loadStudents();
  }

  private loadAccounts(force = false): Observable<void> {
    return this.loadBranches().pipe(switchMap(() => this.ensureLoaded('accounts', this.api.getAccounts(), res => {
      this.accounts$.next(this.unwrap(res).map((a, i) => ({
        id: String(a.id || i + 1),
        code: a.account_code || '',
        name: a.name || '',
        type: a.type || '',
        branch: a.branch_name || this.branchName(a.branch_id),
        openingBalance: Number(a.opening_balance) || 0,
        currentBalance: Number(a.current_balance) || 0,
        status: a.status || 'Active'
      })));
    }, force)));
  }

  private loadReceipts(force = false): Observable<void> {
    return this.loadBranches().pipe(switchMap(() => this.ensureLoaded('receipts', this.api.getReceipts(), res => {
      this.receipts$.next(this.unwrap(res).map((r, i) => ({
        id: String(r.id || i + 1),
        receiptNo: String(r.receipt_no || ''),
        date: this.fmtDate(r.receipt_date),
        from: r.received_from || '',
        studentId: String(r.student_id || ''),
        studentName: r.student_name || r.received_from || '',
        course: r.course || '',
        branch: r.branch_name || this.branchName(r.branch_id),
        amount: Number(r.amount) || 0,
        voucherNo: r.voucher_no || '',
        details: r.details || '',
        toAccount: r.to_account_name || '',
        paymentMode: r.payment_mode || '',
        referenceNo: r.reference_no || '',
        remark: r.remark || ''
      })));
    }, force)));
  }

  private loadPayments(force = false): Observable<void> {
    return this.ensureLoaded('payments', this.api.getPayments(), res => {
      this.payments$.next(this.unwrap(res).map((p, i) => ({
        id: String(p.id || i + 1),
        voucherNo: p.voucher_no || '',
        date: this.fmtDate(p.payment_date),
        paidTo: p.paid_to || '',
        category: p.category || '',
        account: p.account_name || '',
        branch: p.branch_name || '',
        amount: Number(p.amount) || 0,
        paymentMode: p.payment_mode || '',
        remarks: p.remarks || ''
      })));
    }, force);
  }

  private loadFeePending(force = false): Observable<void> {
    return this.loadBranches().pipe(switchMap(() => this.ensureLoaded('fee-pending', this.api.getFeePendingReport(), res => {
      this.feePendingEntries$.next(this.unwrap(res).map((f, i) => ({
        studentName: f.name || '',
        phoneNumber: f.phone || '',
        informationStatus: f.status || '',
        balanceAmount: Number(f.balance_amount) || 0,
        branch: this.branchName(f.branch_id)
      })));
    }, force)));
  }

  private loadFollowUps(force = false): Observable<void> {
    return this.ensureLoaded('follow-ups', this.api.getFollowUps(), res => {
      this.followUps$.next(this.unwrap(res).map((f, i) => ({
        id: String(f.id || i + 1),
        studentId: String(f.student_id || ''),
        studentName: f.student_name || '',
        phone: '',
        course: '',
        date: f.followup_date || '',
        type: f.followup_type_name || '',
        enquirySource: '',
        remark: f.remarks || '',
        nextFollowUpDate: f.next_followup_date || '',
        status: f.status || 'Open'
      })));
    }, force);
  }

  private loadUsers(force = false): Observable<void> {
    return this.ensureLoaded('users', this.api.getUsers(), res => {
      this.users$.next(this.unwrap(res).map((u, i) => ({
        slNo: Number(u.id) || i + 1,
        userName: u.username || '',
        userType: u.role_name || 'User',
        branch: u.branch_name || '',
        phoneNo: u.phone || '',
        hasDelete: true,
        hasEdit: true
      })));
    }, force);
  }

  private loadDepartmentPerms(force = false): Observable<void> {
    return this.ensureLoaded('dept-perms', this.api.getDepartmentPermissions(), res => {
      this.departmentPerms$.next(this.unwrap(res).map((d, i) => ({
        slNo: Number(d.sort_order || d.id) || i + 1,
        branch: d.branch_name || '',
        department: d.department_name || '',
        view: false,
        viewAll: false
      })));
    }, force);
  }

  private loadMenuPerms(force = false): Observable<void> {
    return this.ensureLoaded('menu-perms', this.api.getMenuPermissions(), res => {
      this.menuPerms$.next(this.unwrap(res).map((m, i) => ({
        slNo: Number(m.sort_order || m.id) || i + 1,
        menu: m.name || '',
        view: false,
        edit: false,
        delete: false,
        hasEdit: !!m.has_edit,
        hasDelete: !!m.has_delete
      })));
    }, force);
  }

  private loadRoles(force = false): Observable<void> {
    return this.ensureLoaded('roles', this.api.getRoles(), res => {
      this.roles$.next(this.unwrap(res).map((r, i) => ({
        slNo: Number(r.id) || i + 1,
        role: r.name || '',
        under: r.role_under || r.description || '',
        hasDelete: true,
        hasEdit: true
      })));
    }, force);
  }

  private loadCompanyInfo(force = false): Observable<void> {
    return this.ensureLoaded('company-info', this.api.getCompanyInfo(), res => {
      const c = res?.data;
      if (!c) return;
      this.companyInfo$.next({
        companyName: c.company_name || '',
        phoneNo: c.phone_no || '',
        email: c.email || '',
        address: c.address || '',
        landPhone: c.land_phone || '',
        website: c.website || ''
      });
    }, force);
  }

  // Force reload wrappers used after CRUD operations.
  private refreshBranchOptions() { this.loadBranches(true).subscribe(); }
  private refreshDepartments() { this.loadDepartments(true).subscribe(); }
  private refreshCourses() { this.loadCourses(true).subscribe(); }
  private refreshStudents() { this.loadStudentData(true).subscribe(); }
  private refreshAccounts() { this.loadAccounts(true).subscribe(); }
  private refreshReceipts() { this.loadReceipts(true).subscribe(); }
  private refreshPayments() { this.loadPayments(true).subscribe(); }
  private refreshFeePending() { this.loadFeePending(true).subscribe(); }
  private refreshFollowUps() { this.loadFollowUps(true).subscribe(); }
  private refreshUsers() { this.loadUsers(true).subscribe(); }
  private refreshRoles() { this.loadRoles(true).subscribe(); }
  private refreshFollowupTypes() { this.loadFollowupTypes(true).subscribe(); }
  private refreshEnquirySources() { this.loadEnquirySources(true).subscribe(); }
  private refreshStatusSettings() { this.loadStatus(true).subscribe(); }
  private refreshCompanyInfo() { this.loadCompanyInfo(true).subscribe(); }

  // ---------- Observables used by components ----------
  getStudentListRows(): Observable<StudentListRow[]> {
    return this.cached('students', () => this.loadStudentData(), this.studentListRows$);
  }
  getDepartmentItems(): Observable<DepartmentItem[]> { return this.cached('departments', () => this.loadDepartments(), this.departmentItems$); }
  getDeptStatusOptions(): Observable<StatusOption[]> { return this.cached('settings:status', () => this.loadStatus(), this.deptStatusOptions$); }
  getBranchItems(): Observable<BranchItem[]> { return this.cached('branches', () => this.loadBranches(), this.branchItems$); }
  getBranchDeptOptions(): Observable<DepartmentOption[]> { return this.cached('departments', () => this.loadDepartments(), this.branchDeptOptions$); }
  getCourseItems(): Observable<CourseItem[]> { return this.cached('courses', () => this.loadCourses(), this.courseItems$); }
  getBranchFees(): Observable<CourseBranchFee[]> { return this.cached('branches', () => this.loadBranches(), this.branchFees$); }
  getStudents(): Observable<Student[]> { return this.cached('students', () => this.loadStudentData(), this.students$); }

  getStudentByName(name: string): Observable<Student | null> {
    return this.getStudents().pipe(map(students => {
      const match = students.find(s => String(s.name || '').toLowerCase() === String(name || '').toLowerCase());
      return match || null;
    }));
  }
  getUserRows(): Observable<UserRow[]> { return this.cached('users', () => this.loadUsers(), this.users$); }
  getRoleRows(): Observable<RoleRow[]> { return this.cached('roles', () => this.loadRoles(), this.roles$); }
  getDepartmentPerms(): Observable<DepartmentPermRow[]> {
    return this.cached('dept-perms', () => this.loadDepartmentPerms(), this.departmentPerms$)
      .pipe(map(items => items.map(d => ({ ...d }))));
  }
  getMenuPerms(): Observable<MenuPermRow[]> {
    return this.cached('menu-perms', () => this.loadMenuPerms(), this.menuPerms$)
      .pipe(map(items => items.map(m => ({ ...m }))));
  }
  getFollowupTypeItems(): Observable<FollowupTypeItem[]> { return this.cached('settings:followup_type', () => this.loadFollowupTypes(), this.followupTypeItems$); }
  getEnquirySourceItems(): Observable<EnquirySourceItem[]> { return this.cached('settings:enquiry_source', () => this.loadEnquirySources(), this.enquirySourceItems$); }
  getStatusSettingsItems(): Observable<StatusItem[]> { return this.cached('settings:status', () => this.loadStatus(), this.statusSettingsItems$); }
  getCompanyInfo(): Observable<CompanyInfo> { return this.cached('company-info', () => this.loadCompanyInfo(), this.companyInfo$); }
  getFollowUps(): Observable<StudentFollowUp[]> { return this.cached('follow-ups', () => this.loadFollowUps(), this.followUps$); }
  getReceipts(): Observable<Receipt[]> { return this.cached('receipts', () => this.loadReceipts(), this.receipts$); }
  getFeePendingEntries(): Observable<FeePendingItem[]> { return this.cached('fee-pending', () => this.loadFeePending(), this.feePendingEntries$); }

  getFeeReceiptEntries(from?: string, to?: string): Observable<any[]> {
    return new Observable<any[]>(observer => {
      this.api.getFeeReceiptReport(this.toYMD(from), this.toYMD(to, '2100-12-31')).subscribe({
        next: res => {
          observer.next(this.unwrap(res).map((r, i) => ({
            slNo: i + 1,
            date: this.fmtDate(r.receipt_date),
            name: r.student_name || r.received_from || '',
            phone: r.phone || '',
            email: r.email || '',
            course: r.course || '',
            voucherNumber: r.voucher_no || '',
            amount: Number(r.amount) || 0,
            description: r.details || '',
            branch: r.branch_name || this.branchName(r.branch_id)
          })));
          observer.complete();
        },
        error: err => observer.error(err)
      });
    });
  }

  private toYMD(value?: string, fallback = '2000-01-01'): string {
    if (!value) return fallback;
    const d = new Date(value);
    if (isNaN(d.getTime())) return fallback;
    return d.toISOString().split('T')[0];
  }
  getPayments(): Observable<Payment[]> { return this.cached('payments', () => this.loadPayments(), this.payments$); }
  getAccounts(): Observable<Account[]> { return this.cached('accounts', () => this.loadAccounts(), this.accounts$); }
  getBranches(): Observable<Branch[]> { return this.cached('branches', () => this.loadBranches(), this.branches$); }

  getFollowupTypes(): Observable<SettingItem[]> {
    return this.getFollowupTypeItems().pipe(map(items => items.map((item, i) => ({
      id: String(item.slNo), code: `FT-0${i + 1}`, name: item.name, status: 'Active' as const
    }))));
  }

  getEnquirySources(): Observable<SettingItem[]> {
    return this.getEnquirySourceItems().pipe(map(items => items.map((item, i) => ({
      id: String(item.slNo), code: `SRC-0${i + 1}`, name: item.name, status: 'Active' as const
    }))));
  }

  addStudent(student: any): void {
    const matchedBranch = student.branch
      ? this.branchesCache.find(b => String(b.name).toLowerCase() === String(student.branch).toLowerCase())
      : null;
    const branchId = student.branch_id || (matchedBranch ? Number(matchedBranch.id) : null);
    const deptId = student.department_id || (student.department ? this.departmentIdByName[student.department] || null : null);

    this.api.createStudent({
      student_code: student.code || `STU-${Date.now()}`,
      name: student.name || '',
      phone: student.phone || '',
      email: student.email || '',
      parents_mobile: student.parentsMobile || '',
      whatsapp: student.whatsapp || '',
      address: student.address || '',
      facebook: student.facebook || '',
      alt_email: student.altEmail || '',
      enquiry_source: student.enquiry_source || student.enquirySource || '',
      enquiry_type: student.enquiry_type || student.enquiryType || '',
      course_id: student.course_id || null,
      branch_id: branchId,
      department_id: deptId,
      batch: student.batch || '',
      admission_date: student.admission_date || student.admissionDate || null,
      fees_total: student.fees_total || student.feesTotal || 0,
      fees_paid: student.fees_paid || student.feesPaid || 0,
      status: student.status || 'Active'
    }).subscribe({ next: () => this.refreshStudents(), error: err => console.error('[ApiService] create student failed:', err) });
  }

  setBranch(branch: string): void { this.currentBranchSubject.next(branch); }

  // ---------- Settings CRUD ----------
  addDepartmentItem(item: Omit<DepartmentItem, 'slNo'>) {
    const tempId = Date.now();
    const tempItem: DepartmentItem = {
      slNo: tempId,
      name: item.name,
      followUp: item.followUp || 'yes',
      order: Number(item.order) || tempId
    };
    const current = this.departmentItems$.value || [];
    this.departmentItems$.next([...current, tempItem]);
    const currentBranchDept = this.branchDeptOptions$.value || [];
    this.branchDeptOptions$.next([...currentBranchDept, { slNo: tempId, selected: false, name: item.name }]);
    queueMicrotask(() => this.appRef.tick());

    this.api.createDepartment({ code: `DEP-${Date.now()}`, name: item.name, head_of_department_id: null })
      .subscribe({
        next: () => {
          this.refreshDepartments();
        },
        error: e => {
          console.error('[ApiService] create department failed:', e);
          this.notify.show(e?.error?.message || 'Failed to create department.', 'Error', 'danger');
          this.refreshDepartments();
        }
      });
  }
  updateDepartmentItem(slNo: number, updated: Partial<DepartmentItem>) {
    const current = this.departmentItems$.value || [];
    this.departmentItems$.next(current.map(d => d.slNo === slNo ? { ...d, ...updated } : d));
    queueMicrotask(() => this.appRef.tick());
    this.api.updateDepartment(slNo, { code: `DEP-${slNo}`, name: updated.name || '', head_of_department_id: null, status: 'Active' })
      .subscribe({ next: () => this.refreshDepartments(), error: e => console.error(e) });
  }
  deleteDepartmentItem(slNo: number) {
    const current = this.departmentItems$.value || [];
    this.departmentItems$.next(current.filter(d => d.slNo !== slNo));
    queueMicrotask(() => this.appRef.tick());
    this.api.deleteDepartment(slNo).subscribe({
      next: () => this.refreshDepartments(),
      error: e => {
        console.error(e);
        this.refreshDepartments();
      }
    });
  }

  addBranchItem(item: Omit<BranchItem, 'slNo'>) {
    const tempId = Date.now();
    const newItem: BranchItem = { slNo: tempId, name: item.name };
    const current = this.branchItems$.value || [];
    this.branchItems$.next([...current, newItem]);
    queueMicrotask(() => this.appRef.tick());

    this.api.createBranch({ code: `BR-${Date.now()}`, name: item.name, city: item.name, phone: '', address: '' })
      .subscribe({
        next: () => {
          this.refreshBranchOptions();
        },
        error: e => {
          console.error('[ApiService] create branch failed:', e);
          this.notify.show(e?.error?.message || 'Failed to create branch.', 'Error', 'danger');
          this.refreshBranchOptions();
        }
      });
  }
  updateBranchItem(slNo: number, updated: Partial<BranchItem>) {
    const current = this.branchItems$.value || [];
    this.branchItems$.next(current.map(b => b.slNo === slNo ? { ...b, ...updated } : b));
    queueMicrotask(() => this.appRef.tick());
    this.api.updateBranch(slNo, { code: `BR-${slNo}`, name: updated.name || '', city: updated.name || '', phone: '', address: '', status: 'Active' })
      .subscribe({ next: () => this.refreshBranchOptions(), error: e => console.error(e) });
  }
  deleteBranchItem(slNo: number) {
    const current = this.branchItems$.value || [];
    this.branchItems$.next(current.filter(b => b.slNo !== slNo));
    queueMicrotask(() => this.appRef.tick());
    this.api.deleteBranch(slNo).subscribe({
      next: () => this.refreshBranchOptions(),
      error: e => {
        console.error(e);
        this.refreshBranchOptions();
      }
    });
  }

  addCourseItem(item: Omit<CourseItem, 'slNo'>) {
    const tempId = Date.now();
    const newItem: CourseItem = {
      slNo: tempId,
      name: item.name,
      department: item.department || '',
      duration: item.duration || '',
      fees: item.fees || 0,
      status: item.status || 'Active',
      hasDelete: true,
      hasEdit: true
    };
    const current = this.courseItems$.value || [];
    this.courseItems$.next([...current, newItem]);
    queueMicrotask(() => this.appRef.tick());

    this.api.createCourse({
      code: `C-${Date.now()}`,
      name: item.name,
      department_id: item.department ? this.departmentIdByName[item.department] || null : null,
      duration: item.duration || '',
      fee: item.fees || 0,
      status: item.status || 'Active'
    }).subscribe({
      next: () => this.refreshCourses(),
      error: e => {
        console.error(e);
        this.refreshCourses();
      }
    });
  }
  updateCourseItem(slNo: number, updated: Partial<CourseItem>) {
    const current = this.courseItems$.value || [];
    this.courseItems$.next(current.map(c => c.slNo === slNo ? { ...c, ...updated } : c));
    queueMicrotask(() => this.appRef.tick());
    this.api.updateCourse(slNo, {
      code: `C-${slNo}`, name: updated.name || '',
      department_id: updated.department ? this.departmentIdByName[updated.department] || null : null,
      duration: updated.duration || '',
      fee: updated.fees || 0, status: updated.status || 'Active'
    }).subscribe({ next: () => this.refreshCourses(), error: e => console.error(e) });
  }
  deleteCourseItem(slNo: number) {
    const current = this.courseItems$.value || [];
    this.courseItems$.next(current.filter(c => c.slNo !== slNo));
    queueMicrotask(() => this.appRef.tick());
    this.api.deleteCourse(slNo).subscribe({
      next: () => this.refreshCourses(),
      error: e => {
        console.error(e);
        this.refreshCourses();
      }
    });
  }

  addStudentListRow(row: Omit<StudentListRow, 'slNo'>) {
    this.addStudent(row);
  }
  updateStudentListRow(slNo: number, updated: Partial<StudentListRow>) {
    this.api.updateStudent(slNo, {
      name: updated.name || '', phone: updated.mobile || '', email: '', course_id: null,
      branch_id: null, department_id: null, fees_total: 0, fees_paid: 0, status: updated.status || 'Active'
    }).subscribe({ next: () => this.refreshStudents(), error: e => console.error(e) });
  }
  updateStudentDetail(id: number, data: {
    name: string; phone: string; email: string;
    course: string; branch: string; department: string;
    feesTotal: number; feesPaid: number; status: string;
  }) {
    const matchedCourse = data.course
      ? this.courseItems$.value.find(c => c.name.toLowerCase() === String(data.course).toLowerCase())
      : null;
    const matchedBranch = data.branch
      ? this.branchesCache.find(b => String(b.name).toLowerCase() === String(data.branch).toLowerCase())
      : null;
    const deptId = data.department ? this.departmentIdByName[data.department] || null : null;

    return this.api.updateStudent(id, {
      name: data.name || '',
      phone: data.phone || '',
      email: data.email || '',
      course_id: matchedCourse ? matchedCourse.slNo : null,
      branch_id: matchedBranch ? Number(matchedBranch.id) : null,
      department_id: deptId,
      fees_total: Number(data.feesTotal) || 0,
      fees_paid: Number(data.feesPaid) || 0,
      status: data.status || 'Active'
    }).pipe(
      tap(() => {
        this.refreshStudents();
        this.loadFeePending(true).subscribe();
      })
    );
  }
  deleteStudentListRow(slNo: number) {
    const currentRows = this.studentListRows$.value || [];
    this.studentListRows$.next(currentRows.filter(s => s.slNo !== slNo));
    const currentStudents = this.students$.value || [];
    this.students$.next(currentStudents.filter(s => Number(s.id) !== slNo));
    queueMicrotask(() => this.appRef.tick());
    this.api.deleteStudent(slNo).subscribe({
      next: () => {
        this.refreshStudents();
        this.loadFeePending(true).subscribe();
      },
      error: e => {
        console.error(e);
        this.refreshStudents();
      }
    });
  }

  addUserRow(user: Omit<UserRow, 'slNo'> & { password?: string; email?: string; role?: string }) {
    const tempId = Date.now();
    const newItem: UserRow = {
      slNo: tempId,
      userName: user.userName,
      userType: user.userType,
      branch: user.branch || '',
      phoneNo: user.phoneNo || '',
      hasDelete: true,
      hasEdit: true
    };
    const current = this.users$.value || [];
    this.users$.next([...current, newItem]);
    queueMicrotask(() => this.appRef.tick());

    const matchedRole = user.role
      ? this.roles$.value.find(r => r.role.toLowerCase() === String(user.role).toLowerCase())
      : null;
    const roleId = matchedRole ? matchedRole.slNo : (String(user.userType).toLowerCase() === 'admin' ? 1 : 2);
    const matchedBranch = user.branch
      ? this.branchesCache.find(b => String(b.name).toLowerCase() === String(user.branch).toLowerCase())
      : null;
    const branchId = matchedBranch ? Number(matchedBranch.id) : null;

    this.api.createUser({
      username: user.userName,
      full_name: user.userName,
      email: user.email || '',
      phone: user.phoneNo || '',
      role_id: roleId,
      branch_id: branchId,
      password: user.password || 'admin123',
      password_hash: user.password || 'admin123'
    }).subscribe({
      next: () => {
        this.refreshUsers();
      },
      error: e => {
        console.error('[ApiService] create user failed:', e);
        this.notify.show(e?.error?.message || 'Failed to create user. Please check if username already exists.', 'Error', 'danger');
        this.refreshUsers();
      }
    });
  }

  updateUserRow(slNo: number, user: Partial<UserRow> & { password?: string; email?: string; role?: string }) {
    const current = this.users$.value || [];
    this.users$.next(current.map(u => u.slNo === slNo ? { ...u, ...user } : u));
    queueMicrotask(() => this.appRef.tick());

    const matchedRole = user.role
      ? this.roles$.value.find(r => r.role.toLowerCase() === String(user.role).toLowerCase())
      : null;
    const roleId = matchedRole ? matchedRole.slNo : (String(user.userType).toLowerCase() === 'admin' ? 1 : 2);
    const matchedBranch = user.branch
      ? this.branchesCache.find(b => String(b.name).toLowerCase() === String(user.branch).toLowerCase())
      : null;
    const branchId = matchedBranch ? Number(matchedBranch.id) : null;

    const payload: any = {
      username: user.userName,
      full_name: user.userName,
      email: user.email || '',
      phone: user.phoneNo || '',
      role_id: roleId,
      branch_id: branchId,
      status: 'Active'
    };
    if (user.password && user.password.trim() && !user.password.includes('•')) {
      payload.password = user.password.trim();
    }

    this.api.updateUser(slNo, payload).subscribe({
      next: () => this.refreshUsers(),
      error: e => {
        console.error('[ApiService] update user failed:', e);
        this.notify.show(e?.error?.message || 'Failed to update user.', 'Error', 'danger');
        this.refreshUsers();
      }
    });
  }
  deleteUserRow(slNo: number) {
    const current = this.users$.value || [];
    this.users$.next(current.filter(u => u.slNo !== slNo));
    queueMicrotask(() => this.appRef.tick());
    this.api.deleteUser(slNo).subscribe({
      next: () => this.refreshUsers(),
      error: e => {
        console.error(e);
        this.refreshUsers();
      }
    });
  }

  addRoleRow(role: Omit<RoleRow, 'slNo'>) {
    this.api.createRole({ name: role.role, role_under: role.under, description: role.under })
      .subscribe({ next: () => this.refreshRoles(), error: e => console.error(e) });
  }
  updateRoleRow(slNo: number, updated: Partial<RoleRow>) {
    this.api.updateRole(slNo, { name: updated.role || '', role_under: updated.under || '', description: updated.under || '' })
      .subscribe({ next: () => this.refreshRoles(), error: e => console.error(e) });
  }
  deleteRoleRow(slNo: number) {
    const current = this.roles$.value || [];
    this.roles$.next(current.filter(r => r.slNo !== slNo));
    queueMicrotask(() => this.appRef.tick());
    this.api.deleteRole(slNo).subscribe({
      next: () => this.refreshRoles(),
      error: e => {
        console.error(e);
        this.refreshRoles();
      }
    });
  }

  private addSetting(type: string, name: string, subject: any, refreshFn: () => void) {
    const tempItem = { slNo: Date.now(), name };
    const current = subject.value || [];
    subject.next([...current, tempItem]);
    queueMicrotask(() => this.appRef.tick());

    const shortCode = `${type.substring(0, 3).toUpperCase()}-${String(Date.now()).slice(-8)}`;
    this.api.createSetting(type, { code: shortCode, name, sort_order: 0 })
      .subscribe({
        next: () => {
          refreshFn();
        },
        error: (e: any) => {
          console.error(`[ApiService] add ${type} failed:`, e?.message || e);
          this.notify.show(`Failed to add ${type}. Please try again.`, 'Error', 'danger');
          refreshFn();
        }
      });
  }
  private updateSetting(subject: BehaviorSubject<any>, type: string, slNo: number, name: string, refreshFn: () => void) {
    const current = subject.value || [];
    subject.next(current.map((item: any) => item.slNo === slNo ? { ...item, name } : item));
    queueMicrotask(() => this.appRef.tick());
    this.api.updateSetting(slNo, { name, sort_order: 0, status: 'Active' })
      .subscribe({
        next: () => refreshFn(),
        error: e => {
          console.error(e);
          refreshFn();
        }
      });
  }
  private deleteSettingItem(subject: BehaviorSubject<any>, slNo: number, refreshFn: () => void) {
    const current = subject.value || [];
    subject.next(current.filter((item: any) => item.slNo !== slNo));
    queueMicrotask(() => this.appRef.tick());
    this.api.deleteSetting(slNo).subscribe({
      next: () => refreshFn(),
      error: e => {
        console.error(e);
        refreshFn();
      }
    });
  }

  addFollowupTypeItem(name: string) { this.addSetting('followup_type', name, this.followupTypeItems$, () => this.refreshFollowupTypes()); }
  updateFollowupTypeItem(slNo: number, name: string) { this.updateSetting(this.followupTypeItems$, 'followup_type', slNo, name, () => this.refreshFollowupTypes()); }
  deleteFollowupTypeItem(slNo: number) { this.deleteSettingItem(this.followupTypeItems$, slNo, () => this.refreshFollowupTypes()); }

  addEnquirySourceItem(name: string) { this.addSetting('enquiry_source', name, this.enquirySourceItems$, () => this.refreshEnquirySources()); }
  updateEnquirySourceItem(slNo: number, name: string) { this.updateSetting(this.enquirySourceItems$, 'enquiry_source', slNo, name, () => this.refreshEnquirySources()); }
  deleteEnquirySourceItem(slNo: number) { this.deleteSettingItem(this.enquirySourceItems$, slNo, () => this.refreshEnquirySources()); }

  addStatusSettingsItem(name: string) { this.addSetting('status', name, this.statusSettingsItems$, () => this.refreshStatusSettings()); }
  updateStatusSettingsItem(slNo: number, name: string) { this.updateSetting(this.statusSettingsItems$, 'status', slNo, name, () => this.refreshStatusSettings()); }
  deleteStatusSettingsItem(slNo: number) { this.deleteSettingItem(this.statusSettingsItems$, slNo, () => this.refreshStatusSettings()); }

  updateCompanyInfo(info: CompanyInfo) {
    this.api.updateCompanyInfo({
      company_name: info.companyName, phone_no: info.phoneNo, email: info.email,
      address: info.address, land_phone: info.landPhone, website: info.website
    }).subscribe({ next: () => this.refreshCompanyInfo(), error: e => console.error(e) });
  }

  addAccount(acc: Omit<Account, 'id' | 'code'>): Account {
    const local = { ...acc, id: String(Date.now()), code: `ACC-${Date.now()}` } as Account;
    this.api.createAccount({
      account_code: local.code!, name: local.name, type: local.type || '',
      branch_id: null, opening_balance: local.openingBalance || 0, current_balance: local.currentBalance || 0
    }).subscribe({ next: () => this.refreshAccounts(), error: e => console.error(e) });
    return local;
  }
  updateAccount(id: string, updated: Partial<Account>) {
    this.api.updateAccount(Number(id), {
      account_code: updated.code || `ACC-${id}`, name: updated.name || '', type: updated.type || '',
      branch_id: null, opening_balance: updated.openingBalance || 0,
      current_balance: updated.currentBalance || 0, status: updated.status || 'Active'
    }).subscribe({ next: () => this.refreshAccounts(), error: e => console.error(e) });
  }
  deleteAccount(id: string) {
    const current = this.accounts$.value || [];
    this.accounts$.next(current.filter(a => a.id !== id));
    queueMicrotask(() => this.appRef.tick());
    this.api.deleteAccount(Number(id)).subscribe({
      next: () => this.refreshAccounts(),
      error: e => {
        console.error(e);
        this.refreshAccounts();
      }
    });
  }

  addReceipt(receipt: Omit<Receipt, 'id' | 'receiptNo'>): Receipt {
    const local = { ...receipt, id: String(Date.now()), receiptNo: String(Date.now()) } as Receipt;
    const matchedAcc = receipt.toAccount
      ? this.accounts$.value.find(a => a.name.toLowerCase() === String(receipt.toAccount).toLowerCase())
      : null;
    const toAccountId = matchedAcc ? Number(matchedAcc.id) : null;
    const matchedStudent = (receipt.from || receipt.studentName)
      ? this.students$.value.find(s => s.name.toLowerCase() === String(receipt.from || receipt.studentName).toLowerCase())
      : null;
    const studentId = matchedStudent ? Number(matchedStudent.id) : null;
    const matchedBranch = (matchedStudent?.branch || receipt.branch)
      ? this.branchesCache.find(b => String(b.name).toLowerCase() === String(matchedStudent?.branch || receipt.branch).toLowerCase())
      : null;
    const branchId = matchedBranch ? Number(matchedBranch.id) : null;

    this.api.createReceipt({
      receipt_no: local.receiptNo, receipt_date: local.date || null, received_from: local.from || '',
      student_id: studentId, course: receipt.course || matchedStudent?.course || '', branch_id: branchId, amount: local.amount || 0,
      voucher_no: local.voucherNo || '', details: local.details || '', to_account_id: toAccountId,
      payment_mode: local.paymentMode || '', reference_no: local.referenceNo || '', remark: local.remark || ''
    }).subscribe({
      next: () => {
        this.refreshReceipts();
        this.loadFeePending(true).subscribe();
      },
      error: e => console.error(e)
    });
    return local;
  }
  updateReceipt(id: string, receipt: Partial<Receipt>): void {
    const matchedAcc = receipt.toAccount
      ? this.accounts$.value.find(a => a.name.toLowerCase() === String(receipt.toAccount).toLowerCase())
      : null;
    const toAccountId = matchedAcc ? Number(matchedAcc.id) : null;
    const matchedStudent = (receipt.from || receipt.studentName)
      ? this.students$.value.find(s => s.name.toLowerCase() === String(receipt.from || receipt.studentName).toLowerCase())
      : null;
    const studentId = matchedStudent ? Number(matchedStudent.id) : null;
    const matchedBranch = (matchedStudent?.branch || receipt.branch)
      ? this.branchesCache.find(b => String(b.name).toLowerCase() === String(matchedStudent?.branch || receipt.branch).toLowerCase())
      : null;
    const branchId = matchedBranch ? Number(matchedBranch.id) : null;

    this.api.updateReceipt(Number(id), {
      receipt_date: receipt.date ? this.toYMD(receipt.date) : null,
      received_from: receipt.from || receipt.studentName || '',
      student_id: studentId,
      course: receipt.course || matchedStudent?.course || '',
      branch_id: branchId,
      amount: Number(receipt.amount) || 0,
      voucher_no: receipt.voucherNo || '',
      details: receipt.details || '',
      to_account_id: toAccountId
    }).subscribe({
      next: () => {
        this.refreshReceipts();
        this.loadFeePending(true).subscribe();
      },
      error: e => {
        console.error('[ApiService] update receipt failed:', e);
        this.notify.show(e?.error?.message || 'Failed to update receipt.', 'Error', 'danger');
      }
    });
  }
  deleteReceipt(id: string) {
    const current = this.receipts$.value || [];
    this.receipts$.next(current.filter(r => r.id !== id));
    queueMicrotask(() => this.appRef.tick());
    this.api.deleteReceipt(Number(id)).subscribe({
      next: () => {
        this.refreshReceipts();
        this.loadFeePending(true).subscribe();
      },
      error: e => {
        console.error(e);
        this.refreshReceipts();
      }
    });
  }

  addFollowUp(item: Omit<StudentFollowUp, 'id'>) {
    this.api.createFollowUp({
      student_id: Number(item.studentId) || null, assigned_to_id: null, followup_type_id: null,
      followup_date: item.date || null, remarks: item.remark || '',
      next_followup_date: item.nextFollowUpDate || null, status: item.status || 'Open'
    }).subscribe({ next: () => this.refreshFollowUps(), error: e => console.error(e) });
  }
  updateFollowUp(id: string, updated: Partial<StudentFollowUp>) {
    this.api.updateFollowUp(Number(id), {
      student_id: Number(updated.studentId) || null, assigned_to_id: null, followup_type_id: null,
      followup_date: updated.date || null, remarks: updated.remark || '',
      next_followup_date: updated.nextFollowUpDate || null, status: updated.status || 'Open'
    }).subscribe({ next: () => this.refreshFollowUps(), error: e => console.error(e) });
  }
  deleteFollowUp(id: string) {
    const current = this.followUps$.value || [];
    this.followUps$.next(current.filter(f => f.id !== id));
    queueMicrotask(() => this.appRef.tick());
    this.api.deleteFollowUp(Number(id)).subscribe({
      next: () => this.refreshFollowUps(),
      error: e => {
        console.error(e);
        this.refreshFollowUps();
      }
    });
  }
}