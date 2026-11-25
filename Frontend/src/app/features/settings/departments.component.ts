import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../shared/components/icon.component';

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

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="dept-page-container">
      <!-- Header -->
      <div class="dept-header">
        <h1 class="page-title">Department</h1>
        <button type="button" class="btn-create" (click)="openCreateModal()">
          CREATE NEW DEPARTMENT
        </button>
      </div>

      <!-- Department Table Card matching Image 3 -->
      <div class="table-card">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 70px;">Sl No</th>
              <th>Department Name</th>
              <th style="width: 140px;">Follow Up</th>
              <th style="width: 120px;">Order</th>
              <th style="width: 80px; text-align: center;">Edit</th>
              <th style="width: 80px; text-align: center;">Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let d of departments; let i = index">
              <td class="text-secondary">{{ d.slNo }}</td>
              <td class="font-bold text-dark">{{ d.name }}</td>
              <td class="text-secondary">{{ d.followUp }}</td>
              <td class="text-secondary">{{ d.order }}</td>
              <td style="text-align: center;">
                <button
                  type="button"
                  class="btn-action-edit"
                  [ngClass]="getEditClass(i)"
                  (click)="openEditModal(d)"
                  title="Edit Department"
                >
                  <app-icon name="edit" [size]="14"></app-icon>
                </button>
              </td>
              <td style="text-align: center;">
                <button
                  type="button"
                  class="btn-action-delete"
                  [ngClass]="getDeleteClass(i)"
                  (click)="deleteDept(d)"
                  title="Delete Department"
                >
                  <app-icon name="trash-2" [size]="14"></app-icon>
                </button>
              </td>
            </tr>
            <tr *ngIf="departments.length === 0">
              <td colspan="6" class="empty-state">No departments configured.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Department Details Modal matching Image 4 -->
      <div class="modal-backdrop" *ngIf="isModalOpen" (click)="closeModal()">
        <div class="modal-dialog" (click)="$event.stopPropagation()">
          <!-- Modal Blue Header -->
          <div class="modal-header">
            <h3 class="modal-title">Department Details</h3>
            <button type="button" class="modal-close-btn" (click)="closeModal()">✕</button>
          </div>

          <!-- Modal Body: 2 Columns (Form on left, Select Status on right) -->
          <div class="modal-body">
            <div class="modal-columns">
              <!-- Left Column: Form -->
              <div class="col-form">
                <div class="form-group">
                  <label class="form-label">Department Name</label>
                  <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="deptForm.name"
                    placeholder="Enter department name"
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">Follow Up</label>
                  <select class="form-select" [(ngModel)]="deptForm.followUp">
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">Order</label>
                  <input
                    type="number"
                    class="form-input"
                    [(ngModel)]="deptForm.order"
                  />
                </div>

                <!-- Form Action Buttons -->
                <div class="form-btn-row">
                  <button type="button" class="btn-save" (click)="saveDept()">SAVE</button>
                  <button type="button" class="btn-close" (click)="closeModal()">CLOSE</button>
                </div>
              </div>

              <!-- Right Column: Select Status Table -->
              <div class="col-status">
                <div class="status-section-title">Select Status</div>
                <div class="status-table-card">
                  <table class="status-table">
                    <thead>
                      <tr>
                        <th style="width: 55px;">Sl No</th>
                        <th style="width: 65px; text-align: center;">Select</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let s of statusOptions">
                        <td class="text-secondary">{{ s.slNo }}</td>
                        <td style="text-align: center;">
                          <input
                            type="checkbox"
                            class="custom-chk"
                            [(ngModel)]="s.selected"
                          />
                        </td>
                        <td class="status-name">{{ s.name }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dept-page-container {
      padding: 1.75rem 2.25rem;
      background-color: #f8fafc;
      min-height: calc(100vh - 56px);
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    .dept-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.25rem;
    }

    .page-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
      letter-spacing: -0.02em;
    }

    .btn-create {
      background-color: #16a34a;
      color: #ffffff;
      font-weight: 700;
      font-size: 0.8125rem;
      letter-spacing: 0.04em;
      padding: 0.55rem 1.4rem;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      transition: background-color 0.15s ease;
    }

    .btn-create:hover {
      background-color: #15803d;
    }

    /* Table Card */
    .table-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    .data-table thead tr {
      background-color: #ffffff;
      border-bottom: 1px solid #f1f5f9;
    }

    .data-table th {
      padding: 0.95rem 1.25rem;
      font-size: 0.8125rem;
      font-weight: 600;
      color: #475569;
    }

    .data-table tbody tr {
      border-bottom: 1px solid #f1f5f9;
      transition: background-color 0.15s ease;
    }

    .data-table tbody tr:last-child {
      border-bottom: none;
    }

    .data-table tbody tr:hover {
      background-color: #fafbfc;
    }

    .data-table td {
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

    /* Action Buttons (Purple / Blue edit, White / Brown delete) */
    .btn-action-edit,
    .btn-action-delete {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .btn-purple {
      background-color: #7c3aed;
      border: none;
      color: #ffffff;
    }
    .btn-purple:hover {
      background-color: #6d28d9;
    }

    .btn-blue {
      background-color: #2563eb;
      border: none;
      color: #ffffff;
    }
    .btn-blue:hover {
      background-color: #1d4ed8;
    }

    .btn-del-white {
      background-color: #ffffff;
      border: 1px solid #cbd5e1;
      color: #64748b;
    }
    .btn-del-white:hover {
      border-color: #ef4444;
      color: #ef4444;
      background-color: #fef2f2;
    }

    .btn-del-brown {
      background-color: #c2410c;
      border: none;
      color: #ffffff;
    }
    .btn-del-brown:hover {
      background-color: #9a3412;
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

    .modal-dialog {
      background: #ffffff;
      width: 820px;
      max-width: 95vw;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25);
      animation: zoomIn 0.15s ease-out;
    }

    @keyframes zoomIn {
      from { opacity: 0; transform: scale(0.97); }
      to { opacity: 1; transform: scale(1); }
    }

    .modal-header {
      background-color: #2563eb;
      color: #ffffff;
      padding: 0.85rem 1.4rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
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

    .modal-body {
      padding: 1.75rem 2rem;
    }

    .modal-columns {
      display: grid;
      grid-template-columns: 1fr 1fr;
      column-gap: 2.25rem;
    }

    .col-form {
      display: flex;
      flex-direction: column;
      gap: 1.1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
    }

    .form-label {
      font-size: 0.8125rem;
      font-weight: 600;
      color: #334155;
    }

    .form-input,
    .form-select {
      width: 100%;
      height: 38px;
      padding: 0 0.85rem;
      font-size: 0.85rem;
      color: #1e293b;
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      box-sizing: border-box;
      outline: none;
      transition: border-color 0.15s ease;
    }

    .form-input:focus,
    .form-select:focus {
      border-color: #3b82f6;
    }

    .form-btn-row {
      display: flex;
      gap: 0.85rem;
      margin-top: 1rem;
    }

    .btn-save {
      background-color: #16a34a;
      color: #ffffff;
      font-weight: 700;
      font-size: 0.8125rem;
      letter-spacing: 0.05em;
      padding: 0.55rem 1.75rem;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      transition: background-color 0.15s ease;
    }

    .btn-save:hover {
      background-color: #15803d;
    }

    .btn-close {
      background-color: #ffffff;
      color: #334155;
      font-weight: 700;
      font-size: 0.8125rem;
      letter-spacing: 0.05em;
      padding: 0.55rem 1.75rem;
      border-radius: 4px;
      border: 1px solid #cbd5e1;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .btn-close:hover {
      background-color: #f8fafc;
      border-color: #94a3b8;
    }

    /* Right Column: Status Table */
    .col-status {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .status-section-title {
      font-size: 0.875rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 0.25rem;
    }

    .status-table-card {
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      overflow: hidden;
      background: #ffffff;
    }

    .status-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    .status-table thead tr {
      background-color: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
    }

    .status-table th {
      padding: 0.65rem 0.85rem;
      font-size: 0.8rem;
      font-weight: 600;
      color: #475569;
    }

    .status-table tbody tr {
      border-bottom: 1px solid #f1f5f9;
    }

    .status-table tbody tr:last-child {
      border-bottom: none;
    }

    .status-table td {
      padding: 0.65rem 0.85rem;
      font-size: 0.825rem;
      color: #334155;
      vertical-align: middle;
    }

    .status-name {
      font-weight: 500;
      color: #1e293b;
    }

    .custom-chk {
      width: 16px;
      height: 16px;
      border-radius: 4px;
      cursor: pointer;
      accent-color: #2563eb;
    }
  `]
})
export class DepartmentsComponent implements OnInit {
  departments: DepartmentItem[] = [
    { slNo: 1, name: 'Accounts', followUp: 'yes', order: 1 },
    { slNo: 2, name: 'Admission', followUp: 'yes', order: 2 },
    { slNo: 3, name: 'CLOSED', followUp: 'no', order: 6 },
    { slNo: 4, name: 'Follow Up', followUp: 'yes', order: 3 },
    { slNo: 5, name: 'JOINED', followUp: 'no', order: 7 },
    { slNo: 6, name: 'Marketing', followUp: 'yes', order: 4 },
    { slNo: 7, name: 'Visa', followUp: 'yes', order: 5 }
  ];

  statusOptions: StatusOption[] = [
    { slNo: 1, selected: false, name: 'Interested' },
    { slNo: 2, selected: false, name: 'Not Interested' },
    { slNo: 3, selected: false, name: 'Payment Pending' },
    { slNo: 4, selected: false, name: 'Payment Received' },
    { slNo: 5, selected: false, name: 'Unknown' }
  ];

  isModalOpen = false;
  isEditMode = false;
  editingIndex = -1;

  deptForm = {
    name: '',
    followUp: 'yes',
    order: 8
  };

  ngOnInit() {}

  getEditClass(index: number): string {
    return index % 2 === 1 ? 'btn-blue' : 'btn-purple';
  }

  getDeleteClass(index: number): string {
    return index % 2 === 1 ? 'btn-del-brown' : 'btn-del-white';
  }

  openCreateModal() {
    this.isEditMode = false;
    this.editingIndex = -1;
    this.deptForm = {
      name: '',
      followUp: 'yes',
      order: this.departments.length + 1
    };
    this.statusOptions.forEach(s => (s.selected = false));
    this.isModalOpen = true;
  }

  openEditModal(d: DepartmentItem) {
    this.isEditMode = true;
    this.editingIndex = this.departments.indexOf(d);
    this.deptForm = {
      name: d.name,
      followUp: d.followUp,
      order: d.order
    };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveDept() {
    if (!this.deptForm.name.trim()) return;

    if (this.isEditMode && this.editingIndex > -1) {
      this.departments[this.editingIndex] = {
        slNo: this.departments[this.editingIndex].slNo,
        name: this.deptForm.name,
        followUp: this.deptForm.followUp,
        order: this.deptForm.order
      };
    } else {
      this.departments.push({
        slNo: this.departments.length + 1,
        name: this.deptForm.name,
        followUp: this.deptForm.followUp,
        order: this.deptForm.order
      });
    }

    this.closeModal();
  }

  deleteDept(d: DepartmentItem) {
    if (confirm(`Are you sure you want to delete ${d.name}?`)) {
      this.departments = this.departments.filter(item => item !== d);
      // Re-index
      this.departments.forEach((item, idx) => (item.slNo = idx + 1));
    }
  }
}
