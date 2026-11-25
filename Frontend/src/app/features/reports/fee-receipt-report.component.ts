import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../../shared/components/icon.component';
import { MockDataService, Branch } from '../../core/mock-data.service';

export interface FeeReceiptEntry {
  slNo: number;
  date: string;
  name: string;
  phone: string;
  email: string;
  course: string;
  voucherNumber: string | number;
  amount: number;
  description: string;
  branch: string;
}

@Component({
  selector: 'app-fee-receipt-report',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IconComponent],
  template: `
    <div class="report-page-container">
      <!-- Page Title -->
      <h1 class="page-title">Fee Receipt Report</h1>

      <!-- Filter Bar Card matching Screenshot -->
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

          <!-- Branch Dropdown -->
          <div class="filter-field">
            <label class="filter-label">Branch</label>
            <select class="filter-select" [(ngModel)]="selectedBranch">
              <option value="All">All</option>
              <option *ngFor="let b of branches" [value]="b.name">{{ b.name }}</option>
            </select>
          </div>

          <!-- Action Buttons -->
          <button type="button" class="btn-search" (click)="onSearch()">SEARCH</button>
          <button type="button" class="btn-export" (click)="exportToCsv()">EXPORT</button>
        </div>
      </div>

      <!-- Report Table Card -->
      <div class="table-card">
        <table class="report-table">
          <thead>
            <tr>
              <th style="width: 60px;">Sl No</th>
              <th style="width: 120px;">Date</th>
              <th style="width: 200px;">Name</th>
              <th style="width: 130px;">Phone</th>
              <th style="width: 180px;">Email</th>
              <th style="width: 200px;">Course</th>
              <th style="width: 130px;">Voucher Number</th>
              <th style="width: 100px;">Amount</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of filteredEntries">
              <td class="text-muted">{{ item.slNo }}</td>
              <td class="text-secondary">{{ item.date }}</td>
              <td>
                <a [routerLink]="['/students/detail', item.name]" [queryParams]="{ tab: 'course' }" class="student-link">
                  {{ item.name }}
                </a>
              </td>
              <td class="text-dark">{{ item.phone }}</td>
              <td class="text-muted">{{ item.email }}</td>
              <td class="text-dark">{{ item.course }}</td>
              <td class="text-center">{{ item.voucherNumber }}</td>
              <td class="font-bold text-dark">{{ item.amount }}</td>
              <td class="text-secondary">{{ item.description }}</td>
            </tr>
            <tr *ngIf="filteredEntries.length === 0">
              <td colspan="9" class="empty-state">No entries found for the selected criteria.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Total Entries & Total Amount Summary -->
      <div class="total-summary-text">
        Total {{ filteredEntries.length }} Entries , Total Amount : {{ totalAmount }}
      </div>
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

    .btn-export {
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

    .btn-export:hover {
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

    .report-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    .report-table thead tr {
      background-color: #ffffff;
      border-bottom: 1px solid #f1f5f9;
    }

    .report-table th {
      padding: 0.95rem 1.15rem;
      font-size: 0.8125rem;
      font-weight: 600;
      color: #475569;
      white-space: nowrap;
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
      padding: 1.1rem 1.15rem;
      font-size: 0.85rem;
      color: #334155;
      white-space: nowrap;
    }

    .student-link {
      color: #2563eb;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
    }

    .student-link:hover {
      text-decoration: underline;
    }

    .font-bold {
      font-weight: 600;
    }

    .text-dark {
      color: #1e293b;
    }

    .text-secondary {
      color: #475569;
    }

    .text-muted {
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

    /* Summary line */
    .total-summary-text {
      margin-top: 1rem;
      font-size: 0.875rem;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: -0.01em;
    }
  `]
})
export class FeeReceiptReportComponent implements OnInit {
  fromDate: string = '05-Feb-2026';
  toDate: string = '23-Nov-2026';
  selectedBranch: string = 'All';

  branches: Branch[] = [];

  entries: FeeReceiptEntry[] = [
    {
      slNo: 1,
      date: '01-Apr-2026',
      name: 'JOHN M P',
      phone: '9847638323',
      email: 'john.mp@mail.in',
      course: 'T20 Training',
      voucherNumber: 1,
      amount: 18000,
      description: 'CASH IN HAND',
      branch: 'Ernakulam'
    },
    {
      slNo: 2,
      date: '03-Apr-2026',
      name: 'ANEETA GEORGE',
      phone: '9946260617',
      email: 'aneeta.g@mail.in',
      course: 'G01 IELTS CRASH',
      voucherNumber: 1,
      amount: 8000,
      description: 'QR CODE BY BANK',
      branch: 'Ernakulam'
    },
    {
      slNo: 3,
      date: '03-Apr-2026',
      name: 'CLINTIN JOSE CLEETUS',
      phone: '9446207873',
      email: 'clintin.jose@mail.in',
      course: 'K02 French A1 Online Class',
      voucherNumber: 1,
      amount: 15000,
      description: 'BANK TRANSFER',
      branch: 'Kaloor'
    },
    {
      slNo: 4,
      date: '04-Apr-2026',
      name: 'AKHIL JOSE',
      phone: '7411919807',
      email: 'akhil.jose@mail.in',
      course: 'A16 IELTS 2 MONTHS',
      voucherNumber: 1,
      amount: 7000,
      description: 'BANK FEES OF BOOK',
      branch: 'Ernakulam'
    }
  ];

  filteredEntries: FeeReceiptEntry[] = [];

  constructor(private mockDataService: MockDataService) {}

  ngOnInit() {
    this.mockDataService.getBranches().subscribe(b => {
      this.branches = b;
    });
    this.filteredEntries = [...this.entries];
  }

  get totalAmount(): number {
    return this.filteredEntries.reduce((acc, curr) => acc + curr.amount, 0);
  }

  onSearch() {
    this.filteredEntries = this.entries.filter(e => {
      if (this.selectedBranch !== 'All' && e.branch !== this.selectedBranch) {
        return false;
      }
      return true;
    });
  }

  exportToCsv() {
    const headers = ['Sl No', 'Date', 'Name', 'Phone', 'Email', 'Course', 'Voucher Number', 'Amount', 'Description'];
    const rows = this.filteredEntries.map(e => [
      e.slNo,
      e.date,
      `"${e.name}"`,
      e.phone,
      e.email,
      `"${e.course}"`,
      e.voucherNumber,
      e.amount,
      `"${e.description}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Fee_Receipt_Report_${this.toDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
