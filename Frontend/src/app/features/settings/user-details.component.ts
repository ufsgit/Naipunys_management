import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../shared/components/icon.component';

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

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
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
              <option value="Select Branch">Select Branch</option>
              <option value="Ernakulam">Ernakulam</option>
              <option value="Thrikkakara">Thrikkakara</option>
              <option value="Angamaly">Angamaly</option>
              <option value="Kaloor">Kaloor</option>
              <option value="Pala">Pala</option>
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
                  <option value="Select Branch">Select Branch</option>
                  <option value="Ernakulam">Ernakulam</option>
                  <option value="Kaloor">Kaloor</option>
                  <option value="Angamaly">Angamaly</option>
                  <option value="Thrikkakara">Thrikkakara</option>
                  <option value="Pala">Pala</option>
                  <option value="Naipunya Overseas">Naipunya Overseas</option>
                </select>
              </div>

              <div class="form-row">
                <label class="form-label required">Role <span class="req">*</span></label>
                <select class="form-select" [(ngModel)]="userForm.role">
                  <option value="Select Role">Select Role</option>
                  <option value="ACCOUNT OFFICER">ACCOUNT OFFICER</option>
                  <option value="ADMIN MANAGER">ADMIN MANAGER</option>
                  <option value="ADMINISTRATION">ADMINISTRATION</option>
                  <option value="DIRECTOR">DIRECTOR</option>
                  <option value="STAFF">STAFF</option>
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
                        <th style="width: 50px;">Sl No</th>
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
                        <th style="width: 50px;">Sl No</th>
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
      background-color: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
    }

    .perm-table th {
      position: sticky;
      top: 0;
      background-color: #f8fafc;
      z-index: 2;
      padding: 0.45rem 0.65rem;
      font-size: 0.75rem;
      font-weight: 600;
      color: #475569;
      border-bottom: 1px solid #e2e8f0;
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
  selectedBranch = 'Select Branch';

  users: UserRow[] = [
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
    status: 'Working',
    branch: 'Select Branch',
    role: 'Select Role',
    address: '',
    location: '',
    district: '',
    state: '',
    country: '',
    pincode: '',
    phone: '',
    email: ''
  };

  departmentPerms: DepartmentPermRow[] = [
    // Angamaly (1-7)
    { slNo: 1, branch: 'Angamaly', department: 'Admission', view: false, viewAll: false },
    { slNo: 2, branch: '', department: 'Accounts', view: false, viewAll: false },
    { slNo: 3, branch: '', department: 'CLOSED', view: false, viewAll: false },
    { slNo: 4, branch: '', department: 'Marketing', view: false, viewAll: false },
    { slNo: 5, branch: '', department: 'Follow Up', view: false, viewAll: false },
    { slNo: 6, branch: '', department: 'JOINED', view: false, viewAll: false },
    { slNo: 7, branch: '', department: 'Visa', view: false, viewAll: false },
    // Ernakulam (8-14)
    { slNo: 8, branch: 'Ernakulam', department: 'Accounts', view: false, viewAll: false },
    { slNo: 9, branch: '', department: 'Admission', view: false, viewAll: false },
    { slNo: 10, branch: '', department: 'CLOSED', view: false, viewAll: false },
    { slNo: 11, branch: '', department: 'Follow Up', view: false, viewAll: false },
    { slNo: 12, branch: '', department: 'JOINED', view: false, viewAll: false },
    { slNo: 13, branch: '', department: 'Marketing', view: false, viewAll: false },
    { slNo: 14, branch: '', department: 'Visa', view: false, viewAll: false },
    // Kaloor (15-21)
    { slNo: 15, branch: 'Kaloor', department: 'CLOSED', view: false, viewAll: false },
    { slNo: 16, branch: '', department: 'JOINED', view: false, viewAll: false },
    { slNo: 17, branch: '', department: 'Admission', view: false, viewAll: false },
    { slNo: 18, branch: '', department: 'Follow Up', view: false, viewAll: false },
    { slNo: 19, branch: '', department: 'Accounts', view: false, viewAll: false },
    { slNo: 20, branch: '', department: 'Visa', view: false, viewAll: false },
    { slNo: 21, branch: '', department: 'Marketing', view: false, viewAll: false },
    // Naipunya Overseas (22-28)
    { slNo: 22, branch: 'Naipunya Overseas', department: 'Admission', view: false, viewAll: false },
    { slNo: 23, branch: '', department: 'Accounts', view: false, viewAll: false },
    { slNo: 24, branch: '', department: 'CLOSED', view: false, viewAll: false },
    { slNo: 25, branch: '', department: 'Follow Up', view: false, viewAll: false },
    { slNo: 26, branch: '', department: 'JOINED', view: false, viewAll: false },
    { slNo: 27, branch: '', department: 'Visa', view: false, viewAll: false },
    { slNo: 28, branch: '', department: 'Marketing', view: false, viewAll: false },
    // Pala (29-33)
    { slNo: 29, branch: 'Pala', department: 'Accounts', view: false, viewAll: false },
    { slNo: 30, branch: '', department: 'Admission', view: false, viewAll: false },
    { slNo: 31, branch: '', department: 'Follow Up', view: false, viewAll: false },
    { slNo: 32, branch: '', department: 'Marketing', view: false, viewAll: false },
    { slNo: 33, branch: '', department: 'Visa', view: false, viewAll: false },
    // Thrikkakara (34-40)
    { slNo: 34, branch: 'Thrikkakara', department: 'CLOSED', view: false, viewAll: false },
    { slNo: 35, branch: '', department: 'Admission', view: false, viewAll: false },
    { slNo: 36, branch: '', department: 'Accounts', view: false, viewAll: false },
    { slNo: 37, branch: '', department: 'Follow Up', view: false, viewAll: false },
    { slNo: 38, branch: '', department: 'JOINED', view: false, viewAll: false },
    { slNo: 39, branch: '', department: 'Marketing', view: false, viewAll: false },
    { slNo: 40, branch: '', department: 'Visa', view: false, viewAll: false }
  ];

  menuPerms: MenuPermRow[] = [
    { slNo: 1, menu: 'Create New', view: false, edit: false, delete: false, hasEdit: false, hasDelete: true },
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

  ngOnInit() {
    this.filteredUsers = [...this.users];
  }

  onSearch() {
    this.filteredUsers = this.users.filter(u => {
      const matchName = !this.searchUsername.trim() || u.userName.toLowerCase().includes(this.searchUsername.toLowerCase());
      const matchBranch = this.selectedBranch === 'Select Branch' || u.branch === this.selectedBranch;
      return matchName && matchBranch;
    });
  }

  openCreateModal() {
    this.isEditMode = false;
    this.userForm = {
      userName: '',
      password: '',
      userType: 'User',
      status: 'Working',
      branch: 'Select Branch',
      role: 'Select Role',
      address: '',
      location: '',
      district: '',
      state: '',
      country: '',
      pincode: '',
      phone: '',
      email: ''
    };
    this.isModalOpen = true;
  }

  openEditModal(u: UserRow) {
    this.isEditMode = true;
    this.userForm = {
      userName: u.userName,
      password: '••••••••',
      userType: u.userType,
      status: 'Working',
      branch: u.branch,
      role: 'Select Role',
      address: '',
      location: '',
      district: '',
      state: '',
      country: '',
      pincode: '',
      phone: u.phoneNo,
      email: ''
    };
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

    this.users.push({
      slNo: this.users.length + 1,
      userName: this.userForm.userName,
      userType: this.userForm.userType,
      branch: this.userForm.branch === 'Select Branch' ? 'Ernakulam' : this.userForm.branch,
      phoneNo: this.userForm.phone,
      hasDelete: true,
      hasEdit: false
    });

    this.filteredUsers = [...this.users];
    this.closeModal();
  }

  deleteUser(u: UserRow) {
    if (confirm(`Are you sure you want to delete ${u.userName}?`)) {
      this.users = this.users.filter(item => item !== u);
      this.filteredUsers = this.filteredUsers.filter(item => item !== u);
    }
  }
}
