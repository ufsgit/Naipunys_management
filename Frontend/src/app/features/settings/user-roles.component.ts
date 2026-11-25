import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../shared/components/icon.component';

export interface UserRoleItem {
  slNo: number;
  role: string;
  under: string;
  hasDelete: boolean;
  hasEdit: boolean;
}

@Component({
  selector: 'app-user-roles',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="roles-page-container">
      <!-- Title -->
      <h1 class="page-title">User Role</h1>

      <!-- Create Role Inline Card matching Image 3 exactly -->
      <div class="create-role-card">
        <div class="form-row">
          <div class="field-group">
            <label class="field-label">Role Name</label>
            <input
              type="text"
              class="form-input role-name-input"
              [(ngModel)]="roleForm.roleName"
            />
          </div>

          <div class="field-group">
            <label class="field-label">Role Under</label>
            <select class="form-select role-under-select" [(ngModel)]="roleForm.roleUnder">
              <option value="Select">Select</option>
              <option value="DIRECTOR">DIRECTOR</option>
              <option value="HEAD OPERATION">HEAD OPERATION</option>
              <option value="ACCOUNT OFFICER">ACCOUNT OFFICER</option>
              <option value="ADMIN MANAGER">ADMIN MANAGER</option>
            </select>
          </div>

          <div class="btn-group">
            <button type="button" class="btn-save" (click)="saveRole()">SAVE</button>
            <button type="button" class="btn-cancel" (click)="cancelForm()">CANCEL</button>
          </div>
        </div>
      </div>

      <!-- Roles Table Card matching Image 3 exactly -->
      <div class="table-card">
        <table class="roles-table">
          <thead>
            <tr>
              <th style="width: 70px;">Sl No</th>
              <th style="width: 320px;">Role</th>
              <th>Under</th>
              <th style="width: 80px; text-align: center;">Edit</th>
              <th style="width: 80px; text-align: center;">Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let r of roles; let i = index">
              <td class="text-secondary">{{ r.slNo }}</td>
              <td class="font-bold text-dark">{{ r.role }}</td>
              <td class="text-secondary">{{ r.under }}</td>
              <td style="text-align: center;">
                <button
                  type="button"
                  class="btn-action-edit"
                  [ngClass]="getEditClass(i)"
                  (click)="openEditRole(r)"
                  title="Edit Role"
                >
                  <app-icon name="edit" [size]="14"></app-icon>
                </button>
              </td>
              <td style="text-align: center;">
                <button
                  type="button"
                  class="btn-action-delete"
                  (click)="deleteRole(r)"
                  title="Delete Role"
                >
                  <app-icon name="trash-2" [size]="14"></app-icon>
                </button>
              </td>
            </tr>
            <tr *ngIf="roles.length === 0">
              <td colspan="5" class="empty-state">No roles configured.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .roles-page-container {
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

    /* Create Role Card */
    .create-role-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 0.95rem 1.4rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
    }

    .form-row {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .field-group {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .field-label {
      font-size: 0.825rem;
      font-weight: 500;
      color: #475569;
    }

    .form-input {
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

    .role-name-input {
      width: 220px;
    }

    .form-select {
      height: 36px;
      min-width: 180px;
      padding: 0 1.75rem 0 0.85rem;
      font-size: 0.825rem;
      color: #1e293b;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      outline: none;
      cursor: pointer;
    }

    .form-input:focus,
    .form-select:focus {
      border-color: #3b82f6;
    }

    .btn-group {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .btn-save {
      background-color: #16a34a;
      color: #ffffff;
      font-weight: 700;
      font-size: 0.8125rem;
      letter-spacing: 0.05em;
      padding: 0.55rem 1.5rem;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      transition: background-color 0.15s ease;
    }

    .btn-save:hover {
      background-color: #15803d;
    }

    .btn-cancel {
      background-color: #ffffff;
      color: #334155;
      font-weight: 700;
      font-size: 0.8125rem;
      letter-spacing: 0.05em;
      padding: 0.55rem 1.5rem;
      border-radius: 4px;
      border: 1px solid #cbd5e1;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .btn-cancel:hover {
      background-color: #f8fafc;
      border-color: #94a3b8;
    }

    /* Table Card */
    .table-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      overflow-x: auto;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
    }

    .roles-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    .roles-table thead tr {
      background-color: #ffffff;
      border-bottom: 1px solid #f1f5f9;
    }

    .roles-table th {
      padding: 0.95rem 1.25rem;
      font-size: 0.8125rem;
      font-weight: 600;
      color: #475569;
    }

    .roles-table tbody tr {
      border-bottom: 1px solid #f1f5f9;
      transition: background-color 0.15s ease;
    }

    .roles-table tbody tr:last-child {
      border-bottom: none;
    }

    .roles-table tbody tr:hover {
      background-color: #fafbfc;
    }

    .roles-table td {
      padding: 1.1rem 1.25rem;
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
  `]
})
export class UserRolesComponent implements OnInit {
  roles: UserRoleItem[] = [
    { slNo: 1, role: 'ACCOUNT OFFICER', under: 'DIRECTOR', hasDelete: true, hasEdit: true },
    { slNo: 2, role: 'ADMIN MANAGER', under: 'HEAD OPERATION', hasDelete: true, hasEdit: true },
    { slNo: 3, role: 'ADMINISTRATION', under: 'DIRECTOR', hasDelete: true, hasEdit: true },
    { slNo: 4, role: 'ASST MANAGER OVERSEAS', under: 'HEAD OPERATION', hasDelete: true, hasEdit: true },
    { slNo: 5, role: 'CHIEF MARKETING MANAGER', under: 'DIRECTOR', hasDelete: true, hasEdit: true },
    { slNo: 6, role: 'DIRECTOR', under: 'DIRECTOR', hasDelete: true, hasEdit: true },
    { slNo: 7, role: 'HEAD OPERATION', under: 'ACCOUNT OFFICER', hasDelete: true, hasEdit: true },
    { slNo: 8, role: 'MANAGER OVERSEAS', under: 'HEAD OPERATION', hasDelete: true, hasEdit: true },
    { slNo: 9, role: 'STAFF', under: 'ADMIN MANAGER', hasDelete: true, hasEdit: true }
  ];

  getEditClass(index: number): string {
    return index % 2 === 1 ? 'btn-brown' : 'btn-purple';
  }

  roleForm = {
    roleName: '',
    roleUnder: 'Select'
  };

  ngOnInit() {}

  saveRole() {
    if (!this.roleForm.roleName.trim()) return;

    this.roles.push({
      slNo: this.roles.length + 1,
      role: this.roleForm.roleName.toUpperCase(),
      under: this.roleForm.roleUnder === 'Select' ? 'DIRECTOR' : this.roleForm.roleUnder,
      hasDelete: true,
      hasEdit: false
    });

    this.cancelForm();
  }

  cancelForm() {
    this.roleForm = {
      roleName: '',
      roleUnder: 'Select'
    };
  }

  openEditRole(r: UserRoleItem) {
    this.roleForm = {
      roleName: r.role,
      roleUnder: r.under
    };
  }

  deleteRole(r: UserRoleItem) {
    if (confirm(`Are you sure you want to delete role ${r.role}?`)) {
      this.roles = this.roles.filter(item => item !== r);
    }
  }
}
