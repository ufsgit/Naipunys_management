import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../shared/components/icon.component';
import { ConfirmDialogComponent } from '../../shared/components/modal.component';
import { DataService, FollowupTypeItem } from '../../core/data.service';

@Component({
  selector: 'app-followup-types',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, ConfirmDialogComponent],
  template: `
    <div class="settings-page-container">
      <!-- Title -->
      <h1 class="page-title">FollowUp Type</h1>

      <!-- Inline Create / Edit Card matching Image 1 exactly -->
      <div class="create-card">
        <div class="form-row">
          <div class="field-group">
            <label class="field-label">FollowUp Type</label>
            <input
              type="text"
              class="form-input name-input"
              [(ngModel)]="formName"
              placeholder="Enter follow-up type"
              (keyup.enter)="saveItem()"
            />
          </div>

          <div class="btn-group">
            <button type="button" class="btn-save" (click)="saveItem()">SAVE</button>
            <button type="button" class="btn-cancel" (click)="cancelForm()">CANCEL</button>
          </div>
        </div>
      </div>

      <!-- Table Card matching Image 1 exactly -->
      <div class="table-card">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 70px;">Sl No</th>
              <th>FollowUp Type</th>
              <th style="width: 80px; text-align: center;">Edit</th>
              <th style="width: 80px; text-align: center;">Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of items; let i = index">
              <td class="text-secondary">{{ item.slNo }}</td>
              <td class="font-bold text-dark">{{ item.name }}</td>
              <td style="text-align: center;">
                <button
                  type="button"
                  class="btn-action-edit"
                  (click)="openEdit(item, i)"
                  title="Edit FollowUp Type"
                >
                  <app-icon name="edit" [size]="15"></app-icon>
                </button>
              </td>
              <td style="text-align: center;">
                <button
                  type="button"
                  class="btn-action-delete"
                  (click)="deleteItem(item)"
                  title="Delete FollowUp Type"
                >
                  <app-icon name="trash-2" [size]="15"></app-icon>
                </button>
              </td>
            </tr>
            <tr *ngIf="isLoading">
              <td colspan="4" class="text-center loading-state">
                <span class="loading-spinner"></span> Loading follow-up types...
              </td>
            </tr>
            <tr *ngIf="!isLoading && items.length === 0">
              <td colspan="4" class="empty-state">No follow-up types configured.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <app-confirm-dialog
        [isOpen]="isDeleteModalOpen"
        title="Delete FollowUp Type"
        [message]="'Are you sure you want to delete ' + (itemToDelete?.name || '') + '?'"
        confirmText="Delete"
        (confirmEvent)="confirmDelete()"
        (cancelEvent)="isDeleteModalOpen = false; itemToDelete = null"
      ></app-confirm-dialog>
    </div>
  `,
  styles: [`
    .settings-page-container {
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

    /* Create Card */
    .create-card {
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
      gap: 0.85rem;
    }

    .field-label {
      font-size: 0.825rem;
      font-weight: 500;
      color: #475569;
      white-space: nowrap;
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

    .name-input {
      width: 230px;
    }

    .form-input:focus {
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

    .loading-state {
      text-align: center;
      padding: 3rem;
      color: #64748b;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
    }

    .loading-spinner {
      width: 20px;
      height: 20px;
      border: 2px solid #e2e8f0;
      border-top: 2px solid #2563eb;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class FollowupTypesComponent implements OnInit {
  items: FollowupTypeItem[] = [];
  formName = '';
  isEditMode = false;
  editingItem: FollowupTypeItem | null = null;
  isLoading = true;

  constructor(private mockDataService: DataService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.isLoading = true;
    this.mockDataService.getFollowupTypeItems().subscribe({
      next: data => {
        this.items = data;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: err => {
        console.error('[FollowupTypes] load failed:', err);
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  openEdit(item: FollowupTypeItem, index: number) {
    this.isEditMode = true;
    this.editingItem = item;
    this.formName = item.name;
  }

  saveItem() {
    if (!this.formName.trim()) return;

    if (this.isEditMode && this.editingItem) {
      this.mockDataService.updateFollowupTypeItem(this.editingItem.slNo, this.formName.trim());
    } else {
      this.mockDataService.addFollowupTypeItem(this.formName.trim());
    }

    this.cancelForm();
  }

  cancelForm() {
    this.formName = '';
    this.isEditMode = false;
    this.editingItem = null;
  }

  isDeleteModalOpen = false;
  itemToDelete: FollowupTypeItem | null = null;

  deleteItem(item: FollowupTypeItem) {
    this.itemToDelete = item;
    this.isDeleteModalOpen = true;
  }

  confirmDelete() {
    if (this.itemToDelete) {
      this.mockDataService.deleteFollowupTypeItem(this.itemToDelete.slNo);
    }
    this.isDeleteModalOpen = false;
    this.itemToDelete = null;
  }
}

