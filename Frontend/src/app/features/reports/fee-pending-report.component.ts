import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../../shared/components/icon.component';
import { MockDataService } from '../../core/mock-data.service';

export interface FeePendingEntry {
  studentName: string;
  phoneNumber: string;
  informationStatus: 'Running' | 'Stopped' | string;
  balanceAmount: number;
  branch: string;
}

@Component({
  selector: 'app-fee-pending-report',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IconComponent],
  template: `
    <div class="report-page-container">
      <!-- Page Title -->
      <h1 class="page-title">Fees Pending Report</h1>

      <!-- Filter Bar Card matching Screenshot -->
      <div class="filter-card">
        <div class="filter-row">
          <!-- From Date -->
          <div class="filter-field">
            <label class="filter-label">From</label>
            <input type="text" class="filter-input date-input" [(ngModel)]="fromDate" />
          </div>

          <!-- To Date -->
          <div class="filter-field">
            <label class="filter-label">To</label>
            <input type="text" class="filter-input date-input" [(ngModel)]="toDate" />
          </div>

          <!-- Status Dropdown -->
          <div class="filter-field">
            <label class="filter-label">Status</label>
            <select class="filter-select" [(ngModel)]="selectedStatus">
              <option value="All">All</option>
              <option value="Running">Running</option>
              <option value="Stopped">Stopped</option>
            </select>
          </div>

          <!-- Branch Dropdown -->
          <div class="filter-field">
            <label class="filter-label">Branch</label>
            <select class="filter-select" [(ngModel)]="selectedBranch">
              <option value="All">All</option>
              <option value="Kochi Main">Kochi Main</option>
              <option value="Ernakulam">Ernakulam</option>
              <option value="Kaloor">Kaloor</option>
            </select>
          </div>

          <!-- Action Buttons -->
          <button type="button" class="btn-search" (click)="onSearch()">SEARCH</button>
          <button type="button" class="btn-export" (click)="exportToCsv()">
            <app-icon name="download" [size]="14"></app-icon>
            <span>EXPORT</span>
          </button>
        </div>
      </div>

      <!-- Report Table Card -->
      <div class="table-card">
        <table class="report-table">
          <thead>
            <tr>
              <th style="width: 280px;">Student Name</th>
              <th style="width: 260px;">Phone Number</th>
              <th style="width: 260px;">Information Status</th>
              <th style="text-align: right; width: 200px;">Balance Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of filteredEntries">
              <td class="font-bold text-dark">{{ item.studentName }}</td>
              <td class="text-secondary">{{ item.phoneNumber }}</td>
              <td>
                <span
                  class="status-pill"
                  [ngClass]="item.informationStatus === 'Running' ? 'pill-running' : 'pill-stopped'"
                >
                  {{ item.informationStatus }}
                </span>
              </td>
              <td style="text-align: right;" class="balance-text">
                {{ item.balanceAmount | number:'1.2-2' }}
              </td>
            </tr>
            <tr *ngIf="filteredEntries.length === 0">
              <td colspan="4" class="empty-state">No pending fees found for the selected criteria.</td>
            </tr>
          </tbody>
        </table>
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

    .filter-input {
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

    .date-input {
      width: 125px;
    }

    .filter-select {
      height: 36px;
      min-width: 130px;
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
      padding: 0.55rem 1.25rem;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
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
      color: #475569;
    }

    /* Status Capsule Pills matching screenshot */
    .status-pill {
      display: inline-block;
      padding: 0.25rem 0.85rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .pill-running {
      background-color: #dcfce7;
      color: #15803d;
    }

    .pill-stopped {
      background-color: #ffe4e6;
      color: #e11d48;
    }

    /* Orange / Amber Balance Amount */
    .balance-text {
      color: #c2410c;
      font-weight: 600;
      font-size: 0.875rem;
    }

    .empty-state {
      text-align: center;
      padding: 2.5rem;
      color: #94a3b8;
    }
  `]
})
export class FeePendingReportComponent implements OnInit {
  fromDate: string = '01-Oct-2026';
  toDate: string = '23-Nov-2026';
  selectedStatus: string = 'Running';
  selectedBranch: string = 'Kochi Main';

  entries: FeePendingEntry[] = [];
  filteredEntries: FeePendingEntry[] = [];

  constructor(private mockDataService: MockDataService) {}

  ngOnInit() {
    this.mockDataService.getFeePendingEntries().subscribe(data => {
      this.entries = data;
      this.applyFilters();
    });
  }

  onSearch() {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredEntries = this.entries.filter(e => {
      const matchStatus = this.selectedStatus === 'All' || e.informationStatus === this.selectedStatus;
      const matchBranch = this.selectedBranch === 'All' || e.branch === this.selectedBranch;
      return matchStatus && matchBranch;
    });
  }

  exportToCsv() {
    const headers = ['Student Name', 'Phone Number', 'Information Status', 'Balance Amount'];
    const rows = this.filteredEntries.map(e => [
      `"${e.studentName}"`,
      `"${e.phoneNumber}"`,
      e.informationStatus,
      e.balanceAmount.toFixed(2)
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Fees_Pending_Report_${this.toDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
