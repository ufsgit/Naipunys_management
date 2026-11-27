import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../shared/components/icon.component';
import { ConfirmDialogComponent } from '../../shared/components/modal.component';
import { DataService, Payment, Account, Branch } from '../../core/data.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, ConfirmDialogComponent],
  template: `
    <div class="payment-page-container">
      <h1 class="page-title">Payment</h1>

      <!-- Top Filter Card matching Image 2 -->
      <div class="filter-card">
        <div class="filter-row">
          <div class="filter-field">
            <label class="filter-label">From</label>
            <div class="date-input-wrap">
              <input
                type="date"
                class="filter-input date-input"
                [(ngModel)]="filterFrom"
              />
            </div>
          </div>

          <div class="filter-field">
            <label class="filter-label">To</label>
            <div class="date-input-wrap">
              <input
                type="date"
                class="filter-input date-input"
                [(ngModel)]="filterTo"
              />
            </div>
          </div>

          <div class="filter-field">
            <label class="filter-label">Branch</label>
            <select class="filter-select" [(ngModel)]="filterBranch">
              <option value="All">All</option>
              <option *ngFor="let b of branches" [value]="b.name">{{ b.name }}</option>
            </select>
          </div>

          <div class="filter-buttons">
            <button type="button" class="btn-search" (click)="applyFilters()">
              SEARCH
            </button>
            <button type="button" class="btn-new" (click)="openCreateModal()">
              NEW
            </button>
          </div>
        </div>
      </div>

      <!-- Payment Data Table matching Image 2 -->
      <div class="table-card">
        <table class="payment-table">
          <thead>
            <tr>
              <th style="width: 65px;">Sl No</th>
              <th style="width: 125px;">Date</th>
              <th>To</th>
              <th style="width: 110px;">Amount</th>
              <th style="width: 130px;">Voucher No</th>
              <th>Details</th>
              <th style="width: 65px; text-align: center;">Edit</th>
              <th style="width: 65px; text-align: center;">Delete</th>
              <th style="width: 65px; text-align: center;">Print</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of filteredPayments; let i = index">
              <td class="text-secondary">{{ i + 1 }}</td>
              <td class="text-secondary">{{ p.date }}</td>
              <td class="font-bold text-dark">{{ p.paidTo }}</td>
              <td class="font-bold text-dark">{{ p.amount | number:'1.0-2' }}</td>
              <td class="text-secondary">{{ p.voucherNo }}</td>
              <td class="text-secondary">{{ p.remarks || p.category || '-' }}</td>
              <td style="text-align: center;">
                <button
                  type="button"
                  class="btn-action-edit"
                  (click)="openEditModal(p)"
                  title="Edit Payment"
                >
                  <app-icon name="edit" [size]="15"></app-icon>
                </button>
              </td>
              <td style="text-align: center;">
                <button
                  type="button"
                  class="btn-action-delete"
                  (click)="deletePayment(p)"
                  title="Delete Payment"
                >
                  <app-icon name="trash-2" [size]="15"></app-icon>
                </button>
              </td>
              <td style="text-align: center;">
                <button
                  type="button"
                  class="btn-action-print"
                  (click)="printPayment(p)"
                  title="Print Voucher"
                >
                  <app-icon name="printer" [size]="15"></app-icon>
                </button>
              </td>
            </tr>
            <tr *ngIf="filteredPayments.length === 0">
              <td colspan="9" class="empty-state">No payment records found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Total Summary line matching Image 2 -->
      <div class="total-summary-text" *ngIf="filteredPayments.length > 0">
        Total : {{ filteredPayments.length }} Entries , Total Amount : {{ totalAmount | number:'1.0-2' }}
      </div>

      <!-- Footer credit matching Image 2 -->
      <div class="footer-credit">By UFS Technologies</div>

      <!-- Payment Modal matching Image 3 (modern styling) -->
      <div class="modal-backdrop" *ngIf="isModalOpen" (click)="closeModal()">
        <div class="modal-dialog" (click)="$event.stopPropagation()">
          <!-- Modal Header -->
          <div class="modal-header">
            <h3 class="modal-title">{{ isEditMode ? 'Edit Payment' : 'Payment' }}</h3>
            <button type="button" class="modal-close-btn" (click)="closeModal()">✕</button>
          </div>

          <!-- Modal Body matching Image 3 Form Fields -->
          <div class="modal-body">
            <div class="form-row">
              <label class="form-label required">To</label>
              <input
                type="text"
                class="form-input"
                [(ngModel)]="paymentForm.paidTo"
                placeholder="Payee name"
              />
            </div>

            <div class="form-row">
              <label class="form-label required">Date</label>
              <div class="date-input-wrap">
                <input
                  type="date"
                  class="form-input"
                  [(ngModel)]="paymentForm.date"
                />
              </div>
            </div>

            <div class="form-row">
              <label class="form-label required">Amount</label>
              <input
                type="number"
                class="form-input"
                [(ngModel)]="paymentForm.amount"
                placeholder="0.00"
              />
            </div>

            <div class="form-row">
              <label class="form-label">Voucher No</label>
              <input
                type="text"
                class="form-input"
                [(ngModel)]="paymentForm.voucherNo"
                placeholder="e.g. 110"
              />
            </div>

            <div class="form-row">
              <label class="form-label required">From Account</label>
              <select class="form-select" [(ngModel)]="paymentForm.account">
                <option value="">Select</option>
                <option *ngFor="let acc of accounts" [value]="acc.name">{{ acc.name }}</option>
              </select>
            </div>

            <div class="form-row">
              <label class="form-label">Details</label>
              <input
                type="text"
                class="form-input"
                [(ngModel)]="paymentForm.details"
                placeholder="Payment details or remarks"
              />
            </div>
          </div>

          <!-- Modal Footer Actions (SAVE, CANCEL, CLOSE) matching Image 3 -->
          <div class="modal-footer">
            <button type="button" class="btn-modal-save" (click)="savePayment()">SAVE</button>
            <button type="button" class="btn-modal-cancel" (click)="resetForm()">CANCEL</button>
            <button type="button" class="btn-modal-close" (click)="closeModal()">CLOSE</button>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <app-confirm-dialog
        [isOpen]="isDeleteModalOpen"
        title="Delete Payment"
        [message]="'Are you sure you want to delete payment to ' + (paymentToDelete?.paidTo || '') + ' (' + (paymentToDelete?.voucherNo || '') + ')?'"
        confirmText="Delete"
        (confirmEvent)="confirmDelete()"
        (cancelEvent)="isDeleteModalOpen = false; paymentToDelete = null"
      ></app-confirm-dialog>

      <!-- Print Modal -->
      <div class="modal-backdrop" *ngIf="isPrintModalOpen" (click)="isPrintModalOpen = false">
        <div class="modal-dialog print-dialog" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">Payment Voucher</h3>
            <button type="button" class="modal-close-btn" (click)="isPrintModalOpen = false">✕</button>
          </div>
          <div class="modal-body print-body" id="printSection">
            <div class="print-header">
              <h2>NAIPUNYA ACADEMY</h2>
              <p>PAYMENT VOUCHER</p>
            </div>
            <div class="print-details">
              <div class="print-row"><span>Voucher No:</span><strong>{{ paymentToPrint?.voucherNo }}</strong></div>
              <div class="print-row"><span>Date:</span><strong>{{ paymentToPrint?.date }}</strong></div>
              <div class="print-row"><span>Paid To:</span><strong>{{ paymentToPrint?.paidTo }}</strong></div>
              <div class="print-row"><span>Account:</span><strong>{{ paymentToPrint?.account }}</strong></div>
              <div class="print-row"><span>Amount:</span><strong>₹{{ paymentToPrint?.amount | number:'1.2-2' }}</strong></div>
              <div class="print-row"><span>Details:</span><strong>{{ paymentToPrint?.remarks || paymentToPrint?.category }}</strong></div>
            </div>
            <div class="print-signatures">
              <div class="sig-box">Prepared By</div>
              <div class="sig-box">Verified By</div>
              <div class="sig-box">Receiver's Sign</div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-modal-save" (click)="triggerBrowserPrint()">PRINT NOW</button>
            <button type="button" class="btn-modal-close" (click)="isPrintModalOpen = false">CLOSE</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .payment-page-container {
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
      font-weight: 600;
      color: #475569;
    }

    .date-input-wrap {
      position: relative;
      display: inline-flex;
      align-items: center;
    }

    .filter-input {
      height: 36px;
      padding: 0 0.75rem;
      font-size: 0.825rem;
      color: #1e293b;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      outline: none;
      box-sizing: border-box;
    }

    .date-input {
      width: 145px;
    }

    .filter-select {
      height: 36px;
      min-width: 150px;
      padding: 0 1.75rem 0 0.75rem;
      font-size: 0.825rem;
      color: #1e293b;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      outline: none;
      cursor: pointer;
    }

    .filter-input:focus,
    .filter-select:focus {
      border-color: #2563eb;
    }

    .filter-buttons {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-left: auto;
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

    .payment-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    .payment-table thead tr {
      background-color: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
    }

    .payment-table th {
      padding: 0.95rem 1.25rem;
      font-size: 0.8125rem;
      font-weight: 600;
      color: #475569;
    }

    .payment-table tbody tr {
      border-bottom: 1px solid #f1f5f9;
      transition: background-color 0.15s ease;
    }

    .payment-table tbody tr:last-child {
      border-bottom: none;
    }

    .payment-table tbody tr:hover {
      background-color: #fafbfc;
    }

    .payment-table td {
      padding: 1.05rem 1.25rem;
      font-size: 0.85rem;
      color: #334155;
    }

    .font-bold {
      font-weight: 600;
    }

    .text-dark {
      color: #0f172a;
    }

    .text-secondary {
      color: #64748b;
    }

    .empty-state {
      text-align: center;
      padding: 2.5rem;
      color: #94a3b8;
    }

    /* Action Buttons */
    .btn-action-edit,
    .btn-action-delete,
    .btn-action-print {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #e2e8f0;
      background-color: #ffffff;
      color: #64748b;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .btn-action-edit:hover {
      border-color: #3b82f6;
      color: #2563eb;
      background-color: #eff6ff;
    }

    .btn-action-delete:hover {
      border-color: #ef4444;
      color: #dc2626;
      background-color: #fef2f2;
    }

    .btn-action-print:hover {
      border-color: #0284c7;
      color: #0284c7;
      background-color: #f0f9ff;
    }

    /* Summary Bar */
    .total-summary-text {
      margin-top: 1.15rem;
      font-size: 0.875rem;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: -0.01em;
    }

    .footer-credit {
      text-align: center;
      margin-top: 3.5rem;
      font-size: 0.8125rem;
      color: #94a3b8;
      font-weight: 500;
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

    .print-dialog {
      width: 580px;
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
      grid-template-columns: 120px 1fr;
      align-items: center;
      gap: 1rem;
    }

    .form-label {
      font-size: 0.8125rem;
      font-weight: 600;
      color: #334155;
    }

    .required::after {
      content: ' *';
      color: #dc2626;
    }

    .form-input,
    .form-select {
      width: 100%;
      height: 38px;
      padding: 0 0.85rem;
      font-size: 0.85rem;
      color: #1e293b;
      background-color: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      box-sizing: border-box;
      outline: none;
      transition: border-color 0.15s ease;
    }

    .form-input:focus,
    .form-select:focus {
      border-color: #2563eb;
    }

    .modal-footer {
      background-color: #f8fafc;
      padding: 0.9rem 1.35rem;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.75rem;
      border-top: 1px solid #e2e8f0;
    }

    .btn-modal-save {
      background-color: #16a34a;
      color: #ffffff;
      font-weight: 700;
      font-size: 0.8125rem;
      letter-spacing: 0.05em;
      padding: 0.55rem 1.6rem;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      transition: background-color 0.15s ease;
    }

    .btn-modal-save:hover {
      background-color: #15803d;
    }

    .btn-modal-cancel {
      background-color: #2563eb;
      color: #ffffff;
      font-weight: 700;
      font-size: 0.8125rem;
      letter-spacing: 0.05em;
      padding: 0.55rem 1.6rem;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      transition: background-color 0.15s ease;
    }

    .btn-modal-cancel:hover {
      background-color: #1d4ed8;
    }

    .btn-modal-close {
      background-color: #ffffff;
      color: #334155;
      font-weight: 700;
      font-size: 0.8125rem;
      letter-spacing: 0.05em;
      padding: 0.55rem 1.6rem;
      border-radius: 4px;
      border: 1px solid #cbd5e1;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .btn-modal-close:hover {
      background-color: #f8fafc;
      border-color: #94a3b8;
    }

    /* Print styling */
    .print-body {
      background: #ffffff;
      padding: 2rem;
    }

    .print-header {
      text-align: center;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 1rem;
      margin-bottom: 1.5rem;
    }

    .print-header h2 {
      margin: 0;
      font-size: 1.4rem;
      color: #0f172a;
    }

    .print-header p {
      margin: 0.35rem 0 0 0;
      color: #64748b;
      font-weight: 700;
      letter-spacing: 0.1em;
    }

    .print-details {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
    }

    .print-row {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px dashed #e2e8f0;
      padding-bottom: 0.45rem;
    }

    .print-signatures {
      display: flex;
      justify-content: space-between;
      margin-top: 3.5rem;
      padding-top: 1rem;
    }

    .sig-box {
      border-top: 1px solid #94a3b8;
      width: 130px;
      text-align: center;
      font-size: 0.8rem;
      color: #475569;
    }
  `]
})
export class PaymentComponent implements OnInit {
  payments: Payment[] = [];
  filteredPayments: Payment[] = [];
  branches: Branch[] = [];
  accounts: Account[] = [];

  // Filter models
  filterFrom: string = '';
  filterTo: string = '';
  filterBranch: string = 'All';

  // Modal models
  isModalOpen = false;
  isEditMode = false;
  editingPaymentId: string | null = null;

  paymentForm = {
    paidTo: '',
    date: '',
    amount: 0,
    voucherNo: '',
    account: '',
    details: ''
  };

  // Delete modal
  isDeleteModalOpen = false;
  paymentToDelete: Payment | null = null;

  // Print modal
  isPrintModalOpen = false;
  paymentToPrint: Payment | null = null;

  constructor(private dataService: DataService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    this.filterFrom = firstDay.toISOString().split('T')[0];
    this.filterTo = today.toISOString().split('T')[0];

    this.dataService.getBranches().subscribe(b => {
      this.branches = b;
      this.cdr.markForCheck();
    });

    this.dataService.getAccounts().subscribe(a => {
      this.accounts = a;
      this.cdr.markForCheck();
    });

    this.dataService.getPayments().subscribe(data => {
      this.payments = data;
      this.applyFilters();
      this.cdr.markForCheck();
    });
  }

  get totalAmount(): number {
    return this.filteredPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  }

  applyFilters() {
    this.filteredPayments = this.payments.filter(p => {
      const branchMatch = this.filterBranch === 'All' || !p.branch || p.branch.toLowerCase() === this.filterBranch.toLowerCase();
      // Date filter check
      if (!this.filterFrom && !this.filterTo) return branchMatch;

      const pDate = new Date(p.date).getTime();
      const fromDate = this.filterFrom ? new Date(this.filterFrom).getTime() : 0;
      const toDate = this.filterTo ? new Date(this.filterTo).setHours(23, 59, 59, 999) : Infinity;

      if (!isNaN(pDate)) {
        return branchMatch && pDate >= fromDate && pDate <= toDate;
      }
      return branchMatch;
    });
    this.cdr.markForCheck();
  }

  openCreateModal() {
    this.isEditMode = false;
    this.editingPaymentId = null;
    this.paymentForm = {
      paidTo: '',
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      voucherNo: String(Math.floor(100 + Math.random() * 900)),
      account: this.accounts.length > 0 ? this.accounts[0].name : '',
      details: ''
    };
    this.isModalOpen = true;
  }

  openEditModal(p: Payment) {
    this.isEditMode = true;
    this.editingPaymentId = p.id;
    this.paymentForm = {
      paidTo: p.paidTo,
      date: p.date ? new Date(p.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      amount: p.amount,
      voucherNo: p.voucherNo,
      account: p.account || (this.accounts.length > 0 ? this.accounts[0].name : ''),
      details: p.remarks || p.category || ''
    };
    this.isModalOpen = true;
  }

  resetForm() {
    if (this.isEditMode) {
      const p = this.payments.find(item => item.id === this.editingPaymentId);
      if (p) {
        this.openEditModal(p);
      }
    } else {
      this.paymentForm = {
        paidTo: '',
        date: new Date().toISOString().split('T')[0],
        amount: 0,
        voucherNo: String(Math.floor(100 + Math.random() * 900)),
        account: this.accounts.length > 0 ? this.accounts[0].name : '',
        details: ''
      };
    }
  }

  closeModal() {
    this.isModalOpen = false;
  }

  savePayment() {
    if (!this.paymentForm.paidTo.trim()) return;

    if (this.isEditMode && this.editingPaymentId) {
      const targetId = this.editingPaymentId;
      // Optimistic update
      this.payments = this.payments.map(p => p.id === targetId ? {
        ...p,
        paidTo: this.paymentForm.paidTo,
        date: this.paymentForm.date,
        amount: Number(this.paymentForm.amount) || 0,
        voucherNo: this.paymentForm.voucherNo,
        account: this.paymentForm.account,
        remarks: this.paymentForm.details,
        category: this.paymentForm.details
      } : p);
      this.applyFilters();
      this.cdr.markForCheck();

      this.dataService.updatePayment(targetId, {
        paidTo: this.paymentForm.paidTo,
        date: this.paymentForm.date,
        amount: Number(this.paymentForm.amount) || 0,
        voucherNo: this.paymentForm.voucherNo,
        account: this.paymentForm.account,
        remarks: this.paymentForm.details,
        category: this.paymentForm.details
      });
    } else {
      const newPaymentData: Omit<Payment, 'id'> = {
        voucherNo: this.paymentForm.voucherNo || `VCH-${Date.now()}`,
        date: this.paymentForm.date || new Date().toISOString().split('T')[0],
        paidTo: this.paymentForm.paidTo,
        category: this.paymentForm.details || 'General',
        account: this.paymentForm.account,
        branch: this.filterBranch !== 'All' ? this.filterBranch : (this.branches.length > 0 ? this.branches[0].name : ''),
        amount: Number(this.paymentForm.amount) || 0,
        paymentMode: 'Cash',
        remarks: this.paymentForm.details
      };

      // Optimistic addition
      const tempItem: Payment = { ...newPaymentData, id: String(Date.now()) };
      this.payments = [tempItem, ...this.payments];
      this.applyFilters();
      this.cdr.markForCheck();

      this.dataService.addPayment(newPaymentData);
    }

    this.closeModal();
  }

  deletePayment(p: Payment) {
    this.paymentToDelete = p;
    this.isDeleteModalOpen = true;
  }

  confirmDelete() {
    if (this.paymentToDelete) {
      const targetId = this.paymentToDelete.id;
      this.payments = this.payments.filter(p => p.id !== targetId);
      this.applyFilters();
      this.cdr.markForCheck();
      this.dataService.deletePayment(targetId);
    }
    this.isDeleteModalOpen = false;
    this.paymentToDelete = null;
  }

  printPayment(p: Payment) {
    this.paymentToPrint = p;
    this.isPrintModalOpen = true;
  }

  triggerBrowserPrint() {
    window.print();
  }
}
