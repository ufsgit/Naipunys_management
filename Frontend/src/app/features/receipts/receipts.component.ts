import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../shared/components/icon.component';
import { ConfirmDialogComponent } from '../../shared/components/modal.component';
import { DataService, Receipt, Account, Branch } from '../../core/data.service';

@Component({
  selector: 'app-receipts',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, ConfirmDialogComponent],
  template: `
    <div class="receipt-page-container">
      <!-- Title -->
      <h1 class="page-title">Receipt</h1>

      <!-- Filter Bar Card matching Image 1 exactly -->
      <div class="filter-card">
        <div class="filter-row">
          <!-- From Date -->
          <div class="filter-field">
            <label class="filter-label">From</label>
            <div class="date-input-wrap">
              <input type="text" class="filter-input date-input" [(ngModel)]="fromDate" />
              <app-icon name="calendar" [size]="14" customClass="cal-icon"></app-icon>
            </div>
          </div>

          <!-- To Date -->
          <div class="filter-field">
            <label class="filter-label">To</label>
            <div class="date-input-wrap">
              <input type="text" class="filter-input date-input" [(ngModel)]="toDate" />
              <app-icon name="calendar" [size]="14" customClass="cal-icon"></app-icon>
            </div>
          </div>

          <!-- Branch -->
          <div class="filter-field">
            <label class="filter-label">Branch</label>
            <select class="filter-select" [(ngModel)]="selectedBranch">
              <option value="All">All</option>
              <option *ngFor="let b of branches" [value]="b.name">{{ b.name }}</option>
            </select>
          </div>

          <!-- Action Buttons -->
          <button type="button" class="btn-search" (click)="onSearch()">SEARCH</button>
          <button type="button" class="btn-new" (click)="openCreateModal()">NEW</button>
        </div>
      </div>

      <!-- Table Card matching Image 1 exactly -->
      <div class="table-card">
        <table class="receipt-table">
          <thead>
            <tr>
              <th style="width: 70px;">Sl No</th>
              <th style="width: 140px;">Date</th>
              <th style="width: 260px;">From</th>
              <th style="width: 100px; text-align: right;">Amount</th>
              <th style="width: 130px; text-align: center;">Voucher No</th>
              <th>Details</th>
              <th style="width: 70px; text-align: center;">Edit</th>
              <th style="width: 70px; text-align: center;">Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let r of receipts; let i = index">
              <td>{{ i + 1 }}</td>
              <td class="text-secondary">{{ r.date }}</td>
              <td class="font-bold text-dark">{{ r.from || r.studentName }}</td>
              <td class="font-bold text-dark" style="text-align: right;">{{ r.amount }}</td>
              <td class="text-center">{{ r.voucherNo || (i + 1) }}</td>
              <td class="text-secondary">{{ r.details || r.remark }}</td>
              <td style="text-align: center;">
                <button
                  type="button"
                  class="btn-action-edit"
                  [ngClass]="getEditClass(i)"
                  (click)="openEditModal(r)"
                  title="Edit Receipt"
                >
                  <app-icon name="edit" [size]="14"></app-icon>
                </button>
              </td>
              <td style="text-align: center;">
                <button
                  type="button"
                  class="btn-action-delete"
                  (click)="deleteReceipt(r)"
                  title="Delete Receipt"
                >
                  <app-icon name="trash-2" [size]="14"></app-icon>
                </button>
              </td>
            </tr>
            <tr *ngIf="receipts.length === 0">
              <td colspan="8" class="empty-state">No receipts found for the selected period.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Total Entries & Amount Summary -->
      <div class="total-summary-text">
        Total {{ receipts.length }} Entries , Amount {{ totalAmount }}
      </div>

      <!-- Receipt Create / Edit Modal (Matching Image 3 Exactly) -->
      <div class="modal-backdrop" *ngIf="isModalOpen" (click)="closeModal()">
        <div class="modal-dialog" (click)="$event.stopPropagation()">
          <!-- Modal Blue Header -->
          <div class="modal-header">
            <h3 class="modal-title">Receipt</h3>
            <button type="button" class="modal-close-btn" (click)="closeModal()">✕</button>
          </div>

          <!-- Modal Body Form -->
          <div class="modal-body">
            <div class="form-row">
              <label class="form-label">From</label>
              <input
                type="text"
                class="form-input"
                [(ngModel)]="receiptForm.from"
                placeholder="Enter payer name"
              />
            </div>

            <div class="form-row">
              <label class="form-label">Date</label>
              <div class="date-input-wrap modal-date-wrap">
                <input
                  type="date"
                  class="form-input"
                  [(ngModel)]="receiptForm.date"
                />
              </div>
            </div>

            <div class="form-row">
              <label class="form-label">Amount</label>
              <input
                type="number"
                class="form-input"
                [(ngModel)]="receiptForm.amount"
              />
            </div>

            <div class="form-row">
              <label class="form-label">Voucher No</label>
              <div class="voucher-display">{{ receiptForm.voucherNo }}</div>
            </div>

            <div class="form-row">
              <label class="form-label">To Account</label>
              <select class="form-select" [(ngModel)]="receiptForm.toAccount">
                <option value="">Select</option>
                <option *ngFor="let acc of accounts" [value]="acc.name">{{ acc.name }}</option>
              </select>
            </div>

            <div class="form-row">
              <label class="form-label">Details</label>
              <input
                type="text"
                class="form-input"
                [(ngModel)]="receiptForm.details"
                placeholder="Enter transaction details"
              />
            </div>
          </div>

          <!-- Modal Footer Actions (SAVE, CANCEL, CLOSE) -->
          <div class="modal-footer">
            <button type="button" class="btn-modal-save" (click)="saveReceipt()">SAVE</button>
            <button type="button" class="btn-modal-cancel" (click)="closeModal()">CANCEL</button>
            <button type="button" class="btn-modal-close" (click)="closeModal()">CLOSE</button>
          </div>
        </div>
      </div>

      <app-confirm-dialog
        [isOpen]="isDeleteModalOpen"
        title="Delete Receipt"
        [message]="'Are you sure you want to delete receipt #' + (receiptToDelete?.voucherNo || receiptToDelete?.receiptNo || '') + '?'"
        confirmText="Delete"
        (confirmEvent)="confirmDelete()"
        (cancelEvent)="isDeleteModalOpen = false; receiptToDelete = null"
      ></app-confirm-dialog>
    </div>
  `,
  styles: [`
    .receipt-page-container {
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

    .date-input-wrap {
      position: relative;
      display: inline-flex;
      align-items: center;
    }

    .filter-input {
      height: 36px;
      padding: 0 2rem 0 0.75rem;
      font-size: 0.825rem;
      color: #1e293b;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      outline: none;
      box-sizing: border-box;
    }

    .date-input {
      width: 135px;
    }

    .cal-icon {
      position: absolute;
      right: 0.6rem;
      color: #64748b;
      pointer-events: none;
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

    .btn-new {
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

    .btn-new:hover {
      background-color: #15803d;
    }

    /* Table Card */
    .table-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
    }

    .receipt-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    .receipt-table thead tr {
      background-color: #ffffff;
      border-bottom: 1px solid #f1f5f9;
    }

    .receipt-table th {
      padding: 0.95rem 1.25rem;
      font-size: 0.8125rem;
      font-weight: 600;
      color: #475569;
    }

    .receipt-table tbody tr {
      border-bottom: 1px solid #f1f5f9;
      transition: background-color 0.15s ease;
    }

    .receipt-table tbody tr:last-child {
      border-bottom: none;
    }

    .receipt-table tbody tr:hover {
      background-color: #fafbfc;
    }

    .receipt-table td {
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

    .text-center {
      text-align: center;
    }

    .empty-state {
      text-align: center;
      padding: 2.5rem;
      color: #94a3b8;
    }

    /* Action Buttons (Square with rounded corners matching screenshot) */
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

    /* Total Summary Text */
    .total-summary-text {
      margin-top: 1rem;
      font-size: 0.875rem;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: -0.01em;
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
      width: 520px;
      max-width: 95vw;
      border-radius: 12px;
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
      padding: 0.9rem 1.35rem;
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
      padding: 1.6rem;
      display: flex;
      flex-direction: column;
      gap: 1.15rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 110px 1fr;
      align-items: center;
      gap: 1rem;
    }

    .form-label {
      font-size: 0.8125rem;
      font-weight: 600;
      color: #334155;
    }

    .form-input {
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

    .form-input:focus {
      border-color: #3b82f6;
    }

    .form-input::placeholder {
      color: #94a3b8;
    }

    .modal-date-wrap {
      width: 100%;
    }

    .modal-date-wrap .form-input {
      width: 180px;
    }

    .voucher-display {
      font-size: 0.875rem;
      font-weight: 600;
      color: #1e293b;
    }

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
      cursor: pointer;
      transition: border-color 0.15s ease;
    }

    .form-select:focus {
      border-color: #3b82f6;
    }

    /* Modal Footer */
    .modal-footer {
      padding: 1rem 1.6rem;
      display: flex;
      justify-content: center;
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
      padding: 0.55rem 1.75rem;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      transition: background-color 0.15s ease;
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
      padding: 0.55rem 1.75rem;
      border-radius: 4px;
      border: 1px solid #cbd5e1;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .btn-modal-cancel:hover {
      background-color: #f8fafc;
      border-color: #94a3b8;
    }

    .btn-modal-close {
      background-color: #2563eb;
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

    .btn-modal-close:hover {
      background-color: #1d4ed8;
    }
  `]
})
export class ReceiptsComponent implements OnInit {
  receipts: Receipt[] = [];
  allReceipts: Receipt[] = [];
  branches: Branch[] = [];
  accounts: Account[] = [];

  fromDate: string = '';
  toDate: string = '';
  selectedBranch: string = 'All';

  isModalOpen: boolean = false;
  isEditMode: boolean = false;

  receiptForm: {
    id: string;
    from: string;
    date: string;
    amount: number;
    voucherNo: string | number;
    toAccount: string;
    details: string;
  } = {
    id: '',
    from: '',
    date: '',
    amount: 0,
    voucherNo: '',
    toAccount: '',
    details: ''
  };

  constructor(private mockDataService: DataService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.mockDataService.getReceipts().subscribe(rcp => {
      this.allReceipts = rcp;
      this.receipts = [...rcp];
      this.cdr.markForCheck();
    });

    this.mockDataService.getBranches().subscribe(b => {
      this.branches = b;
      this.cdr.markForCheck();
    });

    this.mockDataService.getAccounts().subscribe(acc => {
      this.accounts = acc;
      this.cdr.markForCheck();
    });
  }

  get totalAmount(): number {
    return this.receipts.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  }

  getEditClass(index: number): string {
    if (index % 2 === 1) return 'btn-brown';
    return 'btn-purple';
  }

  onSearch() {
    this.receipts = this.allReceipts.filter(r => {
      if (this.selectedBranch !== 'All' && r.branch && r.branch !== this.selectedBranch) {
        return false;
      }
      return true;
    });
  }

  private toInputDate(value: string): string {
    if (!value) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const d = new Date(value);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
  }

  openCreateModal() {
    this.isEditMode = false;
    this.receiptForm = {
      id: '',
      from: '',
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      voucherNo: '',
      toAccount: '',
      details: ''
    };
    this.isModalOpen = true;
  }

  openEditModal(r: Receipt) {
    this.isEditMode = true;
    this.receiptForm = {
      id: r.id,
      from: r.from || r.studentName || '',
      date: this.toInputDate(r.date),
      amount: r.amount,
      voucherNo: r.voucherNo || '',
      toAccount: r.toAccount || '',
      details: r.details || r.remark || ''
    };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveReceipt() {
    if (!this.receiptForm.from.trim()) return;

    if (this.isEditMode) {
      this.mockDataService.updateReceipt(this.receiptForm.id, {
        from: this.receiptForm.from,
        studentName: this.receiptForm.from,
        date: this.receiptForm.date,
        amount: Number(this.receiptForm.amount) || 0,
        voucherNo: this.receiptForm.voucherNo,
        toAccount: this.receiptForm.toAccount,
        details: this.receiptForm.details
      });
    } else {
      const newReceipt = this.mockDataService.addReceipt({
        date: this.receiptForm.date,
        from: this.receiptForm.from,
        studentId: '',
        studentName: this.receiptForm.from,
        course: '',
        branch: '',
        amount: Number(this.receiptForm.amount) || 0,
        voucherNo: this.receiptForm.voucherNo,
        details: this.receiptForm.details,
        toAccount: this.receiptForm.toAccount,
        paymentMode: '',
        referenceNo: '',
        remark: ''
      });
      this.receipts.push(newReceipt);
      this.allReceipts.push(newReceipt);
    }

    this.closeModal();
  }

  isDeleteModalOpen = false;
  receiptToDelete: Receipt | null = null;

  deleteReceipt(r: Receipt) {
    this.receiptToDelete = r;
    this.isDeleteModalOpen = true;
  }

  confirmDelete() {
    if (this.receiptToDelete) {
      const id = this.receiptToDelete.id;
      this.mockDataService.deleteReceipt(id);
      this.receipts = this.receipts.filter(item => item.id !== id);
      this.allReceipts = this.allReceipts.filter(item => item.id !== id);
    }
    this.isDeleteModalOpen = false;
    this.receiptToDelete = null;
  }
}
