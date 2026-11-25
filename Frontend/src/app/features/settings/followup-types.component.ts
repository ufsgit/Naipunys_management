import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../shared/components/icon.component';

export interface FollowupTypeItem {
  slNo: number;
  name: string;
}

@Component({
  selector: 'app-followup-types',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
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
                  [ngClass]="getEditClass(i)"
                  (click)="openEdit(item, i)"
                  title="Edit FollowUp Type"
                >
                  <app-icon name="edit" [size]="14"></app-icon>
                </button>
              </td>
              <td style="text-align: center;">
                <button
                  type="button"
                  class="btn-action-delete"
                  [ngClass]="getDeleteClass(i)"
                  (click)="deleteItem(item)"
                  title="Delete FollowUp Type"
                >
                  <app-icon name="trash-2" [size]="14"></app-icon>
                </button>
              </td>
            </tr>
            <tr *ngIf="items.length === 0">
              <td colspan="4" class="empty-state">No follow-up types configured.</td>
            </tr>
          </tbody>
        </table>
      </div>
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
  `]
})
export class FollowupTypesComponent implements OnInit {
  items: FollowupTypeItem[] = [
    { slNo: 1, name: 'e-mail' },
    { slNo: 2, name: 'Incoming Call' },
    { slNo: 3, name: 'Outgoing Call' },
    { slNo: 4, name: 'Walkin' }
  ];

  formName = '';
  isEditMode = false;
  editingItem: FollowupTypeItem | null = null;

  ngOnInit() {}

  getEditClass(index: number): string {
    return index % 2 === 1 ? 'btn-blue' : 'btn-purple';
  }

  getDeleteClass(index: number): string {
    return index % 2 === 1 ? 'btn-del-brown' : 'btn-del-white';
  }

  openEdit(item: FollowupTypeItem, index: number) {
    this.isEditMode = true;
    this.editingItem = item;
    this.formName = item.name;
  }

  saveItem() {
    if (!this.formName.trim()) return;

    if (this.isEditMode && this.editingItem) {
      this.editingItem.name = this.formName.trim();
    } else {
      this.items.push({
        slNo: this.items.length + 1,
        name: this.formName.trim()
      });
    }

    this.cancelForm();
  }

  cancelForm() {
    this.formName = '';
    this.isEditMode = false;
    this.editingItem = null;
  }

  deleteItem(item: FollowupTypeItem) {
    if (confirm(`Are you sure you want to delete ${item.name}?`)) {
      this.items = this.items.filter(i => i !== item);
      this.items.forEach((it, idx) => it.slNo = idx + 1);
    }
  }
}
