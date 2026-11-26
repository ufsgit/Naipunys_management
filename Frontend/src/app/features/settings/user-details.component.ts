import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../shared/components/icon.component';
import { ConfirmDialogComponent } from '../../shared/components/modal.component';
import { DataService, UserRow, DepartmentPermRow, MenuPermRow, Branch, RoleRow } from '../../core/data.service';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, ConfirmDialogComponent],
  template: `
    <div class="users-page-container">
      <!-- Title -->
      <h1 class="page-title">Users</h1>

      <!-- Filter Bar Card matching Image 4 exactly -->
      <div class="filter-card">
        <div class="filter-row">
          <div class="filter-field">
            <label class="filter-label">User Name</label>
            <input
              type="text"
              class="filter-input username-input"
              [(ngModel)]="searchUsername"
              placeholder="Search user name"
            />
          </div>

          <div class="filter-field">
            <label class="filter-label">Branch</label>
            <select class="filter-select" [(ngModel)]="selectedBranch">
              <option value="">All Branches</option>
              <option *ngFor="let b of branches" [value]="b.name">{{ b.name }}</option>
            </select>
          </div>

          <button type="button" class="btn-search" (click)="onSearch()">SEARCH</button>
          <button type="button" class="btn-create-user" (click)="openCreateModal()">CREATE NEW USER</button>
        </div>
      </div>

      <!-- Users Table Card matching Image 4 exactly -->
      <div class="table-card">
        <table class="users-table">
          <thead>
            <tr>
              <th style="width: 70px;">Sl No</th>
              <th style="width: 220px;">User Name</th>
              <th style="width: 180px;">User Type</th>
              <th style="width: 200px;">Branch</th>
              <th>Phone No.</th>
              <th style="width: 80px; text-align: center;">Edit</th>
              <th style="width: 80px; text-align: center;">Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let u of filteredUsers; let i = index">
              <td class="text-secondary">{{ u.slNo }}</td>
              <td class="font-bold text-dark">{{ u.userName }}</td>
              <td class="text-secondary">{{ u.userType }}</td>
              <td class="text-secondary">{{ u.branch }}</td>
              <td class="text-secondary">{{ u.phoneNo }}</td>
              <td style="text-align: center;">
                <button
                  type="button"
                  class="btn-action-edit"
                  [ngClass]="getEditClass(i)"
                  (click)="openEditModal(u)"
                  title="Edit User"
                >
                  <app-icon name="edit" [size]="14"></app-icon>
                </button>
              </td>
              <td style="text-align: center;">
                <button
                  type="button"
                  class="btn-action-delete"
                  (click)="deleteUser(u)"
                  title="Delete User"
                >
                  <app-icon name="trash-2" [size]="14"></app-icon>
                </button>
              </td>
            </tr>
            <tr *ngIf="filteredUsers.length === 0">
              <td colspan="7" class="empty-state">No users found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- User Details Create / Edit Modal matching Image 2 exactly -->
      <div class="modal-backdrop" *ngIf="isModalOpen" (click)="closeModal()">
        <div class="modal-dialog user-modal-dialog" (click)="$event.stopPropagation()">
          <!-- Modal Blue Header -->
          <div class="modal-header">
            <h3 class="modal-title">User Details</h3>
            <button type="button" class="modal-close-btn" (click)="closeModal()">✕</button>
          </div>

          <!-- Modal Body 2 Columns -->
          <div class="modal-body user-modal-body">
            <!-- Left Column: User Personal & Account Info -->
            <div class="user-modal-col left-col">
              <div class="form-row">
                <label class="form-label required">User Name <span class="req">*</span></label>
                <input
                  type="text"
                  class="form-input"
                  [(ngModel)]="userForm.userName"
                  placeholder="Enter user name"
                />
              </div>

              <div class="form-row">
                <label class="form-label required">Password <span class="req">*</span></label>
                <input
                  type="password"
                  class="form-input password-input"
                  [(ngModel)]="userForm.password"
                  placeholder="Enter password"
                />
              </div>

              <div class="form-row">
                <label class="form-label required">User Type <span class="req">*</span></label>
                <select class="form-select" [(ngModel)]="userForm.userType">
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div class="form-row">
                <label class="form-label required">Status <span class="req">*</span></label>
                <select class="form-select" [(ngModel)]="userForm.status">
                  <option value="Working">Working</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div class="form-row">
                <label class="form-label required">Branch <span class="req">*</span></label>
                <select class="form-select" [(ngModel)]="userForm.branch">
                  <option value="">Select Branch</option>
                  <option *ngFor="let b of branches" [value]="b.name">{{ b.name }}</option>
                </select>
              </div>

              <div class="form-row">
                <label class="form-label required">Role <span class="req">*</span></label>
                <select class="form-select" [(ngModel)]="userForm.role">
                  <option value="">Select Role</option>
                  <option *ngFor="let r of roles" [value]="r.role">{{ r.role }}</option>
                </select>
              </div>

              <!-- Address Group -->
              <div class="address-group">
                <div class="form-row address-row">
                  <label class="form-label">Address</label>
                  <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="userForm.address"
                    placeholder=""
                  />
                </div>
                <div class="form-row sub-addr">
                  <div class="empty-label"></div>
                  <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="userForm.location"
                    placeholder="Location"
                  />
                </div>
                <div class="form-row sub-addr">
                  <div class="empty-label"></div>
                  <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="userForm.district"
                    placeholder="District"
                  />
                </div>
                <div class="form-row sub-addr">
                  <div class="empty-label"></div>
                  <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="userForm.state"
                    placeholder="State"
                  />
                </div>
                <div class="form-row sub-addr">
                  <div class="empty-label"></div>
                  <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="userForm.country"
                    placeholder="Country"
                  />
                </div>
                <div class="form-row sub-addr">
                  <div class="empty-label"></div>
                  <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="userForm.pincode"
                    placeholder="Pincode"
                  />
                </div>
              </div>

              <div class="form-row">
                <label class="form-label">Phone No.</label>
                <input
                  type="text"
                  class="form-input"
                  [(ngModel)]="userForm.phone"
                  placeholder="Enter phone number"
                />
              </div>

              <div class="form-row">
                <label class="form-label">E-mail</label>
                <input
                  type="email"
                  class="form-input"
                  [(ngModel)]="userForm.email"
                  placeholder="example@domain.com"
                />
              </div>
            </div>

            <!-- Right Column: Departments & Menu Permissions -->
            <div class="user-modal-col right-col">
              <!-- Select Departments Table -->
              <div class="perm-section">
                <div class="perm-header">
                  <span class="perm-title">Select Departments</span>
                  <div class="select-all-box">
                    <span>Select All</span>
                    <input type="checkbox" (change)="toggleAllDeptView($event)" class="form-checkbox" />
                    <input type="checkbox" (change)="toggleAllDeptViewAll($event)" class="form-checkbox" />
                  </div>
                </div>

                <div class="perm-table-box">
                  <table class="perm-table">
                    <thead>
                      <tr>
                        <th style="width: 50px;">SI No</th>
                        <th style="width: 100px;">Branch</th>
                        <th>Department</th>
                        <th style="width: 50px; text-align: center;">View</th>
                        <th style="width: 65px; text-align: center;">View All</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let d of departmentPerms">
                        <td class="text-secondary">{{ d.slNo }}</td>
                        <td class="text-secondary">{{ d.branch }}</td>
                        <td class="font-medium">{{ d.department }}</td>
                        <td style="text-align: center;">
                          <input type="checkbox" [(ngModel)]="d.view" class="form-checkbox" />
                        </td>
                        <td style="text-align: center;">
                          <input type="checkbox" [(ngModel)]="d.viewAll" class="form-checkbox" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Select Menu Table -->
              <div class="perm-section">
                <div class="perm-header">
                  <span class="perm-title">Select Menu</span>
                  <div class="select-all-box">
                    <span>Select All</span>
                    <input type="checkbox" (change)="toggleAllMenuView($event)" class="form-checkbox" />
                  </div>
                </div>

                <div class="perm-table-box">
                  <table class="perm-table">
                    <thead>
                      <tr>
                        <th style="width: 50px;">SI No</th>
                        <th>Menu</th>
                        <th style="width: 50px; text-align: center;">View</th>
                        <th style="width: 50px; text-align: center;">Edit</th>
                        <th style="width: 50px; text-align: center;">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let m of menuPerms">
                        <td class="text-secondary">{{ m.slNo }}</td>
                        <td class="font-medium">{{ m.menu }}</td>
                        <td style="text-align: center;">
                          <input type="checkbox" [(ngModel)]="m.view" class="form-checkbox" />
                        </td>
                        <td style="text-align: center;">
                          <input type="checkbox" *ngIf="m.hasEdit" [(ngModel)]="m.edit" class="form-checkbox" />
                        </td>
                        <td style="text-align: center;">
                          <input type="checkbox" *ngIf="m.hasDelete" [(ngModel)]="m.delete" class="form-checkbox" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="modal-footer">
            <button type="button" class="btn-modal-save" (click)="saveUser()">SAVE</button>
            <button type="button" class="btn-modal-cancel" (click)="closeModal()">CANCEL</button>
          </div>
        </div>
      </div>

      <app-confirm-dialog
        [isOpen]="isDeleteModalOpen"
        title="Delete User"
        [message]="'Are you sure you want to delete ' + (userToDelete?.userName || '') + '?'"
        confirmText="Delete"
        (confirmEvent)="confirmDelete()"
        (cancelEvent)="isDeleteModalOpen = false; userToDelete = null"
      ></app-confirm-dialog>
    </div>
  `,
  styles: [`
    .users-page-container {
      padding: 1.75rem 2.25rem;
      background-color: #f8fafc;
      min-height: calc(100vh - 56px);
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    .page-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 1.25rem 0;
      letter-spacing: -0.02em;
    }

    /* Filter Card */
    .filter-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 0.85rem 1.4rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
    }

    .filter-row {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .filter-field {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .filter-label {
      font-size: 0.825rem;
      font-weight: 500;
      color: #475569;
    }

    .filter-input {
      height: 36px;
      padding: 0 0.85rem;
      font-size: 0.825rem;
      color: #1e293b;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      outline: none;
      box-sizing: border-box;
    }

    .username-input {
      width: 190px;
    }

    .filter-select {
      height: 36px;
      min-width: 140px;
      padding: 0 1.75rem 0 0.75rem;
      font-size: 0.825rem;
      color: #1e293b;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      outline: none;
      cursor: pointer;
    }

    .filter-input:focus,
    .filter-select:focus {
      border-color: #3b82f6;
    }

    .btn-search {
      background-color: #2563eb;
      color: #ffffff;
      font-weight: 700;
      font-size: 0.8125rem;
      letter-spacing: 0.05em;
      padding: 0.55rem 1.4rem;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      transition: background-color 0.15s ease;
    }

    .btn-search:hover {
      background-color: #1d4ed8;
    }

    .btn-create-user {
      background-color: #16a34a;
      color: #ffffff;
      font-weight: 700;
      font-size: 0.8125rem;
      letter-spacing: 0.05em;
      padding: 0.55rem 1.4rem;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      transition: background-color 0.15s ease;
    }

    .btn-create-user:hover {
      background-color: #15803d;
    }

    /* Table Card */
    .table-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      overflow-x: auto;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
    }

    .users-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    .users-table thead tr {
      background-color: #ffffff;
      border-bottom: 1px solid #f1f5f9;
    }

    .users-table th {
      padding: 0.95rem 1.25rem;
      font-size: 0.8125rem;
      font-weight: 600;
      color: #475569;
    }

    .users-table tbody tr {
      border-bottom: 1px solid #f1f5f9;
      transition: background-color 0.15s ease;
    }

    .users-table tbody tr:last-child {
      border-bottom: none;
    }

    .users-table tbody tr:hover {
      background-color: #fafbfc;
    }

    .users-table td {
      padding: 1rem 1.25rem;
      font-size: 0.85rem;
      color: #334155;
    }

    .font-bold {
      font-weight: 600;
    }

    .text-dark {
      color: #1e293b;
    }

    .text-secondary {
      color: #64748b;
    }

    /* Action Buttons (Square with rounded corners matching Accounts/Receipts reference) */
    .btn-action-edit,
    .btn-action-delete {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: none;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .btn-purple {
      background-color: #7c3aed;
      color: #ffffff;
    }
    .btn-purple:hover {
      background-color: #6d28d9;
    }

    .btn-brown {
      background-color: #c2410c;
      color: #ffffff;
    }
    .btn-brown:hover {
      background-color: #9a3412;
    }

    .btn-action-delete {
      background-color: #ffffff;
      border: 1px solid #cbd5e1;
      color: #64748b;
    }
    .btn-action-delete:hover {
      border-color: #ef4444;
      color: #ef4444;
      background-color: #fef2f2;
    }

    .empty-state {
      text-align: center;
      padding: 2.5rem;
      color: #94a3b8;
    }

    /* Modal Backdrop & Dialog */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background-color: rgba(15, 23, 42, 0.45);
      backdrop-filter: blur(2px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1.5rem;
      animation: fadeIn 0.15s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .user-modal-dialog {
      background: #ffffff;
      width: 960px;
      max-width: 96vw;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25);
      animation: zoomIn 0.15s ease-out;
      display: flex;
      flex-direction: column;
      max-height: 88vh;
    }

    @keyframes zoomIn {
      from { opacity: 0; transform: scale(0.97); }
      to { opacity: 1; transform: scale(1); }
    }

    .modal-header {
      background-color: #2563eb;
      color: #ffffff;
      padding: 0.9rem 1.35rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
    }

    .modal-title {
      font-size: 1.05rem;
      font-weight: 700;
      margin: 0;
      color: #ffffff;
    }

    .modal-close-btn {
      background: transparent;
      border: none;
      color: #ffffff;
      font-size: 1.15rem;
      font-weight: 700;
      cursor: pointer;
      line-height: 1;
      opacity: 0.85;
      padding: 0.2rem;
    }

    .modal-close-btn:hover {
      opacity: 1;
    }

    .user-modal-body {
      padding: 1.25rem 1.5rem;
      display: grid;
      grid-template-columns: 1fr 1.35fr;
      gap: 1.5rem;
      align-items: start;
    }

    .user-modal-col {
      display: flex;
      flex-direction: column;
      min-height: 0;
    }

    .left-col {
      gap: 0.65rem;
      padding-right: 0.5rem;
    }

    .right-col {
      gap: 0.85rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 100px 1fr;
      align-items: center;
      gap: 0.75rem;
    }

    .form-label {
      font-size: 0.8rem;
      font-weight: 600;
      color: #334155;
    }

    .req {
      color: #ef4444;
    }

    .form-input {
      width: 100%;
      height: 34px;
      padding: 0 0.75rem;
      font-size: 0.825rem;
      color: #1e293b;
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      box-sizing: border-box;
      outline: none;
    }

    .password-input {
      width: 140px;
    }

    .form-select {
      width: 100%;
      height: 34px;
      padding: 0 0.75rem;
      font-size: 0.825rem;
      color: #1e293b;
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      box-sizing: border-box;
      outline: none;
      cursor: pointer;
    }

    .form-input:focus,
    .form-select:focus {
      border-color: #3b82f6;
    }

    .address-group {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .sub-addr {
      grid-template-columns: 100px 1fr;
    }

    .empty-label {
      width: 100px;
    }

    /* Permissions Section (Right Column) */
    .perm-section {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .perm-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
    }

    .perm-title {
      font-size: 0.8125rem;
      font-weight: 600;
      color: #334155;
    }

    .select-all-box {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      font-weight: 600;
      color: #475569;
    }

    .perm-table-box {
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      height: 242px;
      max-height: 242px;
      overflow-y: auto;
      background: #ffffff;
    }

    .perm-table-box::-webkit-scrollbar {
      width: 6px;
    }
    .perm-table-box::-webkit-scrollbar-track {
      background: #f8fafc;
    }
    .perm-table-box::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 3px;
    }
    .perm-table-box::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }

    .perm-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    .perm-table thead tr {
      background-color: #0b63b8;
    }

    .perm-table th {
      position: sticky;
      top: 0;
      background-color: #0b63b8;
      z-index: 2;
      padding: 0.5rem 0.65rem;
      font-size: 0.775rem;
      font-weight: 600;
      color: #ffffff;
      border: none;
    }

    .perm-table tbody tr {
      border-bottom: 1px solid #f1f5f9;
      height: 30px;
    }

    .perm-table tbody tr:last-child {
      border-bottom: none;
    }

    .perm-table td {
      padding: 0.38rem 0.65rem;
      font-size: 0.8rem;
      color: #334155;
      vertical-align: middle;
      height: 30px;
      box-sizing: border-box;
    }

    .font-medium {
      font-weight: 500;
      color: #1e293b;
    }

    .form-checkbox {
      width: 15px;
      height: 15px;
      accent-color: #2563eb;
      cursor: pointer;
    }

    /* Modal Footer */
    .modal-footer {
      padding: 0.85rem 1.6rem;
      display: flex;
      justify-content: flex-start;
      gap: 0.85rem;
      border-top: 1px solid #f1f5f9;
      background-color: #ffffff;
    }

    .btn-modal-save {
      background-color: #16a34a;
      color: #ffffff;
      font-weight: 700;
      font-size: 0.8125rem;
      letter-spacing: 0.05em;
      padding: 0.5rem 1.75rem;
      border-radius: 4px;
      border: none;
      cursor: pointer;
    }

    .btn-modal-save:hover {
      background-color: #15803d;
    }

    .btn-modal-cancel {
      background-color: #ffffff;
      color: #334155;
      font-weight: 700;
      font-size: 0.8125rem;
      letter-spacing: 0.05em;
      padding: 0.5rem 1.75rem;
      border-radius: 4px;
      border: 1px solid #cbd5e1;
      cursor: pointer;
    }

    .btn-modal-cancel:hover {
      background-color: #f8fafc;
      border-color: #94a3b8;
    }
  `]
})
export class UserDetailsComponent implements OnInit {
  searchUsername = '';
  selectedBranch = '';

  users: UserRow[] = [];
  branches: Branch[] = [];
  roles: RoleRow[] = [];

  getEditClass(index: number): string {
    return index % 2 === 1 ? 'btn-brown' : 'btn-purple';
  }

  filteredUsers: UserRow[] = [];

  isModalOpen = false;
  isEditMode = false;

  userForm = {
    userName: '',
    password: '',
    userType: 'User',
    status: '',
    branch: '',
    role: '',
    address: '',
    location: '',
    district: '',
    state: '',
    country: '',
    pincode: '',
    phone: '',
    email: ''
  };

  departmentPerms: DepartmentPermRow[] = [];
  menuPerms: MenuPermRow[] = [];

  constructor(private mockDataService: DataService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.mockDataService.getUserRows().subscribe(data => {
      this.users = data;
      this.onSearch();
      this.cdr.markForCheck();
    });
    this.mockDataService.getDepartmentPerms().subscribe(data => { this.departmentPerms = data; this.cdr.markForCheck(); });
    this.mockDataService.getMenuPerms().subscribe(data => { this.menuPerms = data; this.cdr.markForCheck(); });
    this.mockDataService.getBranches().subscribe(b => { this.branches = b; this.cdr.markForCheck(); });
    this.mockDataService.getRoleRows().subscribe(r => { this.roles = r; this.cdr.markForCheck(); });
  }

  onSearch() {
    this.filteredUsers = this.users.filter(u => {
      const matchName = !this.searchUsername.trim() || u.userName.toLowerCase().includes(this.searchUsername.toLowerCase());
      const matchBranch = !this.selectedBranch || u.branch === this.selectedBranch;
      return matchName && matchBranch;
    });
  }

  openCreateModal() {
    this.isEditMode = false;
    this.userForm = {
      userName: '',
      password: '',
      userType: 'User',
      status: '',
      branch: '',
      role: '',
      address: '',
      location: '',
      district: '',
      state: '',
      country: '',
      pincode: '',
      phone: '',
      email: ''
    };
    this.mockDataService.getDepartmentPerms().subscribe(data => { this.departmentPerms = data; this.cdr.markForCheck(); });
    this.mockDataService.getMenuPerms().subscribe(data => { this.menuPerms = data; this.cdr.markForCheck(); });
    this.isModalOpen = true;
  }

  openEditModal(u: UserRow) {
    this.isEditMode = true;
    this.userForm = {
      userName: u.userName,
      password: '••••••••',
      userType: u.userType,
      status: '',
      branch: u.branch,
      role: '',
      address: '',
      location: '',
      district: '',
      state: '',
      country: '',
      pincode: '',
      phone: u.phoneNo,
      email: ''
    };
    this.mockDataService.getDepartmentPerms().subscribe(data => { this.departmentPerms = data; this.cdr.markForCheck(); });
    this.mockDataService.getMenuPerms().subscribe(data => { this.menuPerms = data; this.cdr.markForCheck(); });
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  toggleAllDeptView(event: any) {
    const checked = event.target.checked;
    this.departmentPerms.forEach(d => d.view = checked);
  }

  toggleAllDeptViewAll(event: any) {
    const checked = event.target.checked;
    this.departmentPerms.forEach(d => d.viewAll = checked);
  }

  toggleAllMenuView(event: any) {
    const checked = event.target.checked;
    this.menuPerms.forEach(m => m.view = checked);
  }

  saveUser() {
    if (!this.userForm.userName.trim()) return;

    this.mockDataService.addUserRow({
      userName: this.userForm.userName,
      password: this.userForm.password,
      email: this.userForm.email,
      role: this.userForm.role,
      userType: this.userForm.userType,
      branch: this.userForm.branch,
      phoneNo: this.userForm.phone,
      hasDelete: true,
      hasEdit: false
    });

    this.closeModal();
  }

  isDeleteModalOpen = false;
  userToDelete: UserRow | null = null;

  deleteUser(u: UserRow) {
    this.userToDelete = u;
    this.isDeleteModalOpen = true;
  }

  confirmDelete() {
    if (this.userToDelete) {
      this.mockDataService.deleteUserRow(this.userToDelete.slNo);
    }
    this.isDeleteModalOpen = false;
    this.userToDelete = null;
  }
}
