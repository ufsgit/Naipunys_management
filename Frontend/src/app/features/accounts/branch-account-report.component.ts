import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Branch } from '../../core/data.service';

export interface BranchAccountRow {
  slNo: number;
  date: string;
  details: string;
  voucherNumber: string;
  payment: number;
  receipt: number;
  description: string;
  branchName?: string;
}

@Component({
  selector: 'app-branch-account-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="report-page-container">
      <h1 class="page-title">Branch Account Report</h1>

      <!-- Top Filter Card matching Image 1 -->
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
              <option *ngFor="let b of branches" [value]="b.id">{{ b.name }}</option>
            </select>
          </div>

          <div class="filter-buttons">
            <button type="button" class="btn-search" (click)="loadReport()">
              SEARCH
            </button>
            <button type="button" class="btn-export" (click)="exportToCSV()">
              EXPORT
            </button>
          </div>
        </div>
      </div>

      <!-- Report Data Table matching Image 1 -->
      <div class="table-card">
        <table class="report-table">
          <thead>
            <tr>
              <th style="width: 130px;">Date</th>
              <th>Details</th>
              <th style="width: 180px;">Voucher Number</th>
              <th style="width: 140px; text-align: right;">Payment</th>
              <th style="width: 140px; text-align: right;">Receipt</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let row of reportData">
              <td class="text-secondary">{{ row.date }}</td>
              <td class="font-bold text-dark">{{ row.details }}</td>
              <td class="text-secondary">{{ row.voucherNumber }}</td>
              <td class="text-danger font-bold text-right">
                {{ row.payment > 0 ? (row.payment | number:'1.2-2') : '-' }}
              </td>
              <td class="text-success font-bold text-right">
                {{ row.receipt > 0 ? (row.receipt | number:'1.2-2') : '-' }}
              </td>
              <td class="text-secondary">{{ row.description || '-' }}</td>
            </tr>
            <tr *ngIf="reportData.length === 0 && !isLoading">
              <td colspan="6" class="empty-state">No transaction records found for the selected period.</td>
            </tr>
            <tr *ngIf="isLoading">
              <td colspan="6" class="loading-state">
                <div class="spinner"></div>
                Loading transactions...
              </td>
            </tr>
          </tbody>
          <tfoot *ngIf="reportData.length > 0">
            <tr class="closing-row">
              <td></td>
              <td class="closing-text">Closing : {{ closingBalance | number:'1.0-2' }}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Footer credit matching Image 1 -->
      <div class="footer-credit">By UFS Technologies</div>
    </div>
  `,
  styles: [`
    .report-page-container {
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

    .btn-export {
      background-color: #0284c7;
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

    .btn-export:hover {
      background-color: #0369a1;
    }

    /* Table Card */
    .table-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
    }

    .report-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    .report-table thead tr {
      background-color: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
    }

    .report-table th {
      padding: 0.95rem 1.25rem;
      font-size: 0.8125rem;
      font-weight: 600;
      color: #475569;
    }

    .report-table tbody tr {
      border-bottom: 1px solid #f1f5f9;
      transition: background-color 0.15s ease;
    }

    .report-table tbody tr:last-child {
      border-bottom: none;
    }

    .report-table tbody tr:hover {
      background-color: #fafbfc;
    }

    .report-table td {
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

    .text-right {
      text-align: right;
    }

    .text-danger {
      color: #dc2626;
    }

    .text-success {
      color: #16a34a;
    }

    .closing-row {
      background-color: #f8fafc;
      border-top: 2px solid #e2e8f0;
    }

    .closing-row td {
      padding: 1rem 1.25rem;
    }

    .closing-text {
      font-size: 0.875rem;
      font-weight: 600;
      color: #334155;
      letter-spacing: -0.01em;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: #94a3b8;
    }

    .loading-state {
      text-align: center;
      padding: 3rem;
      color: #64748b;
    }

    .spinner {
      width: 24px;
      height: 24px;
      border: 3px solid #e2e8f0;
      border-top-color: #2563eb;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      display: inline-block;
      vertical-align: middle;
      margin-right: 0.5rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .footer-credit {
      text-align: center;
      margin-top: 3.5rem;
      font-size: 0.8125rem;
      color: #94a3b8;
      font-weight: 500;
    }
  `]
})
export class BranchAccountReportComponent implements OnInit {
  reportData: BranchAccountRow[] = [];
  branches: Branch[] = [];

  filterFrom: string = '';
  filterTo: string = '';
  filterBranch: string = 'All';

  isLoading: boolean = false;

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

    this.loadReport();
  }

  loadReport() {
    this.isLoading = true;
    const branchId = this.filterBranch !== 'All' ? Number(this.filterBranch) : undefined;
    this.dataService.getBranchAccountReport(this.filterFrom, this.filterTo, branchId).subscribe({
      next: data => {
        this.reportData = data;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: err => {
        console.error('[BranchAccountReport] Failed to load:', err);
        this.reportData = [];
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  get totalPayment(): number {
    return this.reportData.reduce((sum, r) => sum + (Number(r.payment) || 0), 0);
  }

  get totalReceipt(): number {
    return this.reportData.reduce((sum, r) => sum + (Number(r.receipt) || 0), 0);
  }

  get closingBalance(): number {
    return this.totalReceipt - this.totalPayment;
  }

  exportToCSV() {
    if (this.reportData.length === 0) {
      alert('No data to export.');
      return;
    }

    const headers = ['Date', 'Details', 'Voucher Number', 'Payment', 'Receipt', 'Description'];
    const rows = this.reportData.map(r => [
      `"${r.date}"`,
      `"${r.details.replace(/"/g, '""')}"`,
      `"${r.voucherNumber}"`,
      r.payment,
      r.receipt,
      `"${(r.description || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(',')),
      ['', `"Closing : ${this.closingBalance}"`, '', '', '', ''].join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Account_Report_${this.filterFrom}_to_${this.filterTo}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
