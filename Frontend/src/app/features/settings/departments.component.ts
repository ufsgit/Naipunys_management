import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../shared/components/icon.component';
import { ConfirmDialogComponent } from '../../shared/components/modal.component';
import { DataService, DepartmentItem, StatusOption } from '../../core/data.service';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, ConfirmDialogComponent],
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
                  (click)="openEditModal(d)"
                  title="Edit Department"
                >
                  <app-icon name="edit" [size]="15"></app-icon>
                </button>
              </td>
              <td style="text-align: center;">
                <button
                  type="button"
                  class="btn-action-delete"
                  (click)="deleteDept(d)"
                  title="Delete Department"
                >
                  <app-icon name="trash-2" [size]="15"></app-icon>
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

      <app-confirm-dialog
        [isOpen]="isDeleteModalOpen"
        title="Delete Department"
        [message]="'Are you sure you want to delete ' + (deptToDelete?.name || '') + '?'"
        confirmText="Delete"
        (confirmEvent)="confirmDelete()"
        (cancelEvent)="isDeleteModalOpen = false; deptToDelete = null"
      ></app-confirm-dialog>
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

    /* Action Buttons */
    .btn-action-edit,
    .btn-action-delete {
      width: 28px;
      height: 28px;
      border-radius: 4px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: transparent;
      color: #64748b;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .btn-action-edit:hover {
      color: #0b62b6;
      background-color: #f0f7ff;
    }

    .btn-action-delete:hover {
      color: #dc2626;
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
  departments: DepartmentItem[] = [];
  statusOptions: StatusOption[] = [];

  isModalOpen = false;
  isEditMode = false;
  editingIndex = -1;

  deptForm = {
    name: '',
    followUp: 'yes',
    order: 8
  };

  constructor(private mockDataService: DataService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.mockDataService.getDepartmentItems().subscribe(data => {
      this.departments = data;
      this.cdr.markForCheck();
    });
    this.mockDataService.getDeptStatusOptions().subscribe(data => {
      this.statusOptions = data;
      this.cdr.markForCheck();
    });
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
      const targetSlNo = this.departments[this.editingIndex].slNo;
      this.departments = this.departments.map((d, i) => i === this.editingIndex ? {
        ...d,
        name: this.deptForm.name,
        followUp: this.deptForm.followUp,
        order: Number(this.deptForm.order) || d.order
      } : d);
      this.cdr.markForCheck();
      this.mockDataService.updateDepartmentItem(targetSlNo, {
        name: this.deptForm.name,
        followUp: this.deptForm.followUp,
        order: this.deptForm.order
      });
    } else {
      const tempSlNo = this.departments.length > 0 ? Math.max(...this.departments.map(d => d.slNo)) + 1 : 1;
      this.departments = [...this.departments, {
        slNo: tempSlNo,
        name: this.deptForm.name,
        followUp: this.deptForm.followUp,
        order: Number(this.deptForm.order) || tempSlNo
      }];
      this.cdr.markForCheck();
      this.mockDataService.addDepartmentItem({
        name: this.deptForm.name,
        followUp: this.deptForm.followUp,
        order: this.deptForm.order
      });
    }

    this.closeModal();
  }

  isDeleteModalOpen = false;
  deptToDelete: DepartmentItem | null = null;

  deleteDept(d: DepartmentItem) {
    this.deptToDelete = d;
    this.isDeleteModalOpen = true;
  }

  confirmDelete() {
    if (this.deptToDelete) {
      const targetSlNo = this.deptToDelete.slNo;
      this.departments = this.departments.filter(d => d.slNo !== targetSlNo);
      this.cdr.markForCheck();
      this.mockDataService.deleteDepartmentItem(targetSlNo);
    }
    this.isDeleteModalOpen = false;
    this.deptToDelete = null;
  }
}
