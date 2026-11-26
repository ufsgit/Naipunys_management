import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Generic helpers
  get<T = any>(path: string): Observable<T> {
    return this.http.get<T>(`${this.base}/${path}`);
  }

  post<T = any>(path: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.base}/${path}`, body);
  }

  put<T = any>(path: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.base}/${path}`, body);
  }

  delete<T = any>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.base}/${path}`);
  }

  // Students
  getStudents(params?: any): Observable<any> {
    return this.http.get<any>(`${this.base}/students`, { params });
  }
  getStudent(id: number): Observable<any> {
    return this.http.get<any>(`${this.base}/students/${id}`);
  }
  createStudent(data: any): Observable<any> {
    return this.http.post<any>(`${this.base}/students`, data);
  }
  updateStudent(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.base}/students/${id}`, data);
  }
  deleteStudent(id: number): Observable<any> {
    return this.http.delete<any>(`${this.base}/students/${id}`);
  }

  // Courses
  getCourses(): Observable<any> { return this.http.get<any>(`${this.base}/courses`); }
  createCourse(data: any): Observable<any> { return this.http.post<any>(`${this.base}/courses`, data); }
  updateCourse(id: number, data: any): Observable<any> { return this.http.put<any>(`${this.base}/courses/${id}`, data); }
  deleteCourse(id: number): Observable<any> { return this.http.delete<any>(`${this.base}/courses/${id}`); }

  // Branches
  getBranches(): Observable<any> { return this.http.get<any>(`${this.base}/branches`); }
  createBranch(data: any): Observable<any> { return this.http.post<any>(`${this.base}/branches`, data); }
  updateBranch(id: number, data: any): Observable<any> { return this.http.put<any>(`${this.base}/branches/${id}`, data); }
  deleteBranch(id: number): Observable<any> { return this.http.delete<any>(`${this.base}/branches/${id}`); }

  // Departments
  getDepartments(): Observable<any> { return this.http.get<any>(`${this.base}/departments`); }
  createDepartment(data: any): Observable<any> { return this.http.post<any>(`${this.base}/departments`, data); }
  updateDepartment(id: number, data: any): Observable<any> { return this.http.put<any>(`${this.base}/departments/${id}`, data); }
  deleteDepartment(id: number): Observable<any> { return this.http.delete<any>(`${this.base}/departments/${id}`); }

  // Accounts
  getAccounts(branchId?: number): Observable<any> {
    return this.http.get<any>(`${this.base}/accounts`, { params: branchId ? { branch_id: branchId } : {} });
  }
  createAccount(data: any): Observable<any> { return this.http.post<any>(`${this.base}/accounts`, data); }
  updateAccount(id: number, data: any): Observable<any> { return this.http.put<any>(`${this.base}/accounts/${id}`, data); }
  deleteAccount(id: number): Observable<any> { return this.http.delete<any>(`${this.base}/accounts/${id}`); }

  // Receipts
  getReceipts(): Observable<any> { return this.http.get<any>(`${this.base}/receipts`); }
  createReceipt(data: any): Observable<any> { return this.http.post<any>(`${this.base}/receipts`, data); }
  updateReceipt(id: number, data: any): Observable<any> { return this.http.put<any>(`${this.base}/receipts/${id}`, data); }
  deleteReceipt(id: number): Observable<any> { return this.http.delete<any>(`${this.base}/receipts/${id}`); }

  // Payments
  getPayments(): Observable<any> { return this.http.get<any>(`${this.base}/payments`); }
  createPayment(data: any): Observable<any> { return this.http.post<any>(`${this.base}/payments`, data); }
  updatePayment(id: number, data: any): Observable<any> { return this.http.put<any>(`${this.base}/payments/${id}`, data); }
  deletePayment(id: number): Observable<any> { return this.http.delete<any>(`${this.base}/payments/${id}`); }

  // Users & Roles
  getUsers(): Observable<any> { return this.http.get<any>(`${this.base}/users`); }
  createUser(data: any): Observable<any> { return this.http.post<any>(`${this.base}/users`, data); }
  updateUser(id: number, data: any): Observable<any> { return this.http.put<any>(`${this.base}/users/${id}`, data); }
  deleteUser(id: number): Observable<any> { return this.http.delete<any>(`${this.base}/users/${id}`); }
  getRoles(): Observable<any> { return this.http.get<any>(`${this.base}/roles`); }
  createRole(data: any): Observable<any> { return this.http.post<any>(`${this.base}/roles`, data); }
  updateRole(id: number, data: any): Observable<any> { return this.http.put<any>(`${this.base}/roles/${id}`, data); }
  deleteRole(id: number): Observable<any> { return this.http.delete<any>(`${this.base}/roles/${id}`); }

  // Follow-ups
  getFollowUps(params?: any): Observable<any> {
    return this.http.get<any>(`${this.base}/follow-ups`, { params });
  }
  createFollowUp(data: any): Observable<any> { return this.http.post<any>(`${this.base}/follow-ups`, data); }
  updateFollowUp(id: number, data: any): Observable<any> { return this.http.put<any>(`${this.base}/follow-ups/${id}`, data); }
  deleteFollowUp(id: number): Observable<any> { return this.http.delete<any>(`${this.base}/follow-ups/${id}`); }

  // Settings
  getSettings(type: string): Observable<any> { return this.http.get<any>(`${this.base}/settings/${type}`); }
  createSetting(type: string, data: any): Observable<any> { return this.http.post<any>(`${this.base}/settings/${type}`, data); }
  updateSetting(id: number, data: any): Observable<any> { return this.http.put<any>(`${this.base}/settings/${id}`, data); }
  deleteSetting(id: number): Observable<any> { return this.http.delete<any>(`${this.base}/settings/${id}`); }

  // Reports
  getFeePendingReport(branchId?: number): Observable<any> {
    return this.http.get<any>(`${this.base}/reports/fee-pending`, { params: branchId ? { branch_id: branchId } : {} });
  }
  getFeeReceiptReport(from: string, to: string): Observable<any> {
    return this.http.get<any>(`${this.base}/reports/fee-receipt`, { params: { from, to } });
  }

  // Company Info
  getCompanyInfo(): Observable<any> { return this.http.get<any>(`${this.base}/company-info`); }
  updateCompanyInfo(data: any): Observable<any> { return this.http.put<any>(`${this.base}/company-info`, data); }

  // Permissions
  getDepartmentPermissions(): Observable<any> { return this.http.get<any>(`${this.base}/permissions/departments`); }
  getMenuPermissions(): Observable<any> { return this.http.get<any>(`${this.base}/permissions/menus`); }
}
