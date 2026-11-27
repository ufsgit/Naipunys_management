import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../shared/components/icon.component';
import { ConfirmDialogComponent } from '../../shared/components/modal.component';
import { DataService, BranchItem, DepartmentOption } from '../../core/data.service';

@Component({
  selector: 'app-branches',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, ConfirmDialogComponent],
  template: `
    <div class="branch-page-container">
      <!-- Header -->
      <div class="branch-header">
        <h1 class="page-title">Branch</h1>
        <button type="button" class="btn-create" (click)="openCreateModal()">
          CREATE NEW BRANCH
        </button>
      </div>

      <!-- Branch Table Card matching Image 5 -->
      <div class="table-card">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 70px;">Sl No</th>
              <th>Branch Name</th>
              <th style="width: 80px; text-align: center;">Edit</th>
              <th style="width: 80px; text-align: center;">Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let b of branches; let i = index">
              <td class="text-secondary">{{ b.slNo }}</td>
              <td class="font-bold text-dark">{{ b.name }}</td>
              <td style="text-align: center;">
                <button
                  type="button"
                  class="btn-action-edit"
                  (click)="openEditModal(b)"
                  title="Edit Branch"
                >
                  <app-icon name="edit" [size]="15"></app-icon>
                </button>
              </td>
              <td style="text-align: center;">
                <button
                  type="button"
                  class="btn-action-delete"
                  (click)="deleteBranch(b)"
                  title="Delete Branch"
                >
                  <app-icon name="trash-2" [size]="15"></app-icon>
                </button>
              </td>
            </tr>
            <tr *ngIf="branches.length === 0">
              <td colspan="4" class="empty-state">No branches configured.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Branch Details Modal matching Image 1 / Image 9 -->
      <div class="modal-backdrop" *ngIf="isModalOpen" (click)="closeModal()">
        <div class="modal-dialog" (click)="$event.stopPropagation()">
          <!-- Modal Blue Header -->
          <div class="modal-header">
            <h3 class="modal-title">Branch Details</h3>
            <button type="button" class="modal-close-btn" (click)="closeModal()">✕</button>
          </div>

          <!-- Modal Body: 2 Columns (Form on left, Select Departments on right) -->
          <div class="modal-body">
            <div class="modal-columns">
              <!-- Left Column: Form -->
              <div class="col-form">
                <div class="form-row">
                  <label class="form-label required">Branch Name</label>
                  <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="branchForm.name"
                    placeholder="Enter branch name"
                  />
                </div>

                <div class="form-row">
                  <label class="form-label required">Address</label>
                  <div class="address-fields">
                    <input
                      type="text"
                      class="form-input"
                      [(ngModel)]="branchForm.address"
                      placeholder="Address"
                    />
                    <input
                      type="text"
                      class="form-input"
                      [(ngModel)]="branchForm.location"
                      placeholder="Location"
                    />
                    <input
                      type="text"
                      class="form-input"
                      [(ngModel)]="branchForm.district"
                      placeholder="District"
                    />
                    <input
                      type="text"
                      class="form-input"
                      [(ngModel)]="branchForm.state"
                      placeholder="State"
                    />
                    <input
                      type="text"
                      class="form-input"
                      [(ngModel)]="branchForm.country"
                      placeholder="Country"
                    />
                    <input
                      type="text"
                      class="form-input"
                      [(ngModel)]="branchForm.pincode"
                      placeholder="Pin Code"
                    />
                  </div>
                </div>

                <div class="form-row">
                  <label class="form-label required">Phone No.</label>
                  <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="branchForm.phone"
                    placeholder="Enter phone number"
                  />
                </div>

                <div class="form-row">
                  <label class="form-label required">E-mail</label>
                  <input
                    type="email"
                    class="form-input"
                    [(ngModel)]="branchForm.email"
                    placeholder="Enter email address"
                  />
                </div>

                <!-- Form Action Buttons -->
                <div class="form-btn-row">
                  <button type="button" class="btn-save" (click)="saveBranch()">SAVE</button>
                  <button type="button" class="btn-close" (click)="closeModal()">CLOSE</button>
                </div>
              </div>

              <!-- Right Column: Select Departments Table -->
              <div class="col-depts">
                <div class="section-title">Select Departments</div>
                <div class="depts-table-card">
                  <table class="depts-table">
                    <thead>
                      <tr>
                        <th style="width: 55px;">Sl No</th>
                        <th style="width: 65px; text-align: center;">Select</th>
                        <th>Department</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let d of departmentOptions">
                        <td class="text-secondary">{{ d.slNo }}</td>
                        <td style="text-align: center;">
                          <input
                            type="checkbox"
                            class="custom-chk"
                            [(ngModel)]="d.selected"
                          />
                        </td>
                        <td class="dept-name">{{ d.name }}</td>
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
        title="Delete Branch"
        [message]="'Are you sure you want to delete ' + (branchToDelete?.name || '') + '?'"
        confirmText="Delete"
        (confirmEvent)="confirmDelete()"
        (cancelEvent)="isDeleteModalOpen = false; branchToDelete = null"
      ></app-confirm-dialog>
    </div>
  `,
  styles: [`
    .branch-page-container {
      padding: 1.75rem 2.25rem;
      background-color: #f8fafc;
      min-height: calc(100vh - 56px);
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    .branch-header {
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
      width: 860px;
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
      grid-template-columns: 1.1fr 0.9fr;
      column-gap: 2.25rem;
    }

    .col-form {
      display: flex;
      flex-direction: column;
      gap: 0.9rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 110px 1fr;
      align-items: start;
      column-gap: 0.75rem;
    }

    .form-label {
      font-size: 0.8125rem;
      font-weight: 600;
      color: #334155;
      padding-top: 0.5rem;
    }

    .required::after {
      content: ' *';
      color: #dc2626;
    }

    .address-fields {
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
    }

    .form-input {
      width: 100%;
      height: 36px;
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

    .form-input:focus {
      border-color: #3b82f6;
    }

    .form-btn-row {
      display: flex;
      gap: 0.85rem;
      margin-top: 0.75rem;
      padding-left: calc(110px + 0.75rem);
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

    /* Right Column: Departments Table */
    .col-depts {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .section-title {
      font-size: 0.875rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 0.25rem;
    }

    .depts-table-card {
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      overflow: hidden;
      background: #ffffff;
    }

    .depts-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    .depts-table thead tr {
      background-color: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
    }

    .depts-table th {
      padding: 0.65rem 0.85rem;
      font-size: 0.8rem;
      font-weight: 600;
      color: #475569;
    }

    .depts-table tbody tr {
      border-bottom: 1px solid #f1f5f9;
    }

    .depts-table tbody tr:last-child {
      border-bottom: none;
    }

    .depts-table td {
      padding: 0.65rem 0.85rem;
      font-size: 0.825rem;
      color: #334155;
      vertical-align: middle;
    }

    .dept-name {
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
export class BranchesComponent implements OnInit {
  branches: BranchItem[] = [];
  departmentOptions: DepartmentOption[] = [];

  isModalOpen = false;
  isEditMode = false;
  editingIndex = -1;

  branchForm = {
    name: '',
    address: '',
    location: '',
    district: '',
    state: '',
    country: '',
    pincode: '',
    phone: '',
    email: ''
  };

  constructor(private mockDataService: DataService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.mockDataService.getBranchItems().subscribe(data => {
      this.branches = data;
      this.cdr.markForCheck();
    });
    this.mockDataService.getBranchDeptOptions().subscribe(data => {
      this.departmentOptions = data;
      this.cdr.markForCheck();
    });
  }

  openCreateModal() {
    this.isEditMode = false;
    this.editingIndex = -1;
    this.branchForm = {
      name: '',
      address: '',
      location: '',
      district: '',
      state: '',
      country: '',
      pincode: '',
      phone: '',
      email: ''
    };
    this.departmentOptions.forEach(d => (d.selected = false));
    this.isModalOpen = true;
  }

  openEditModal(b: BranchItem) {
    this.isEditMode = true;
    this.editingIndex = this.branches.indexOf(b);
    this.branchForm = {
      name: b.name,
      address: '',
      location: b.name,
      district: '',
      state: '',
      country: '',
      pincode: '',
      phone: '',
      email: ''
    };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveBranch() {
    if (!this.branchForm.name.trim()) return;

    if (this.isEditMode && this.editingIndex > -1) {
      const targetSlNo = this.branches[this.editingIndex].slNo;
      this.branches = this.branches.map((b, i) => i === this.editingIndex ? { ...b, name: this.branchForm.name } : b);
      this.cdr.markForCheck();
      this.mockDataService.updateBranchItem(targetSlNo, {
        name: this.branchForm.name
      });
    } else {
      const tempSlNo = this.branches.length > 0 ? Math.max(...this.branches.map(b => b.slNo)) + 1 : 1;
      this.branches = [...this.branches, { slNo: tempSlNo, name: this.branchForm.name }];
      this.cdr.markForCheck();
      this.mockDataService.addBranchItem({
        name: this.branchForm.name
      });
    }

    this.closeModal();
  }

  isDeleteModalOpen = false;
  branchToDelete: BranchItem | null = null;

  deleteBranch(b: BranchItem) {
    this.branchToDelete = b;
    this.isDeleteModalOpen = true;
  }

  confirmDelete() {
    if (this.branchToDelete) {
      const targetSlNo = this.branchToDelete.slNo;
      this.branches = this.branches.filter(b => b.slNo !== targetSlNo);
      this.cdr.markForCheck();
      this.mockDataService.deleteBranchItem(targetSlNo);
    }
    this.isDeleteModalOpen = false;
    this.branchToDelete = null;
  }
}
