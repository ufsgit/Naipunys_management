import { IconComponent, ModalComponent, ConfirmDialogComponent, PageHeaderComponent, PaginationComponent, FilterBarComponent } from '../../shared/index';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService, Receipt, Branch } from '../../core/mock-data.service';

@Component({
  selector: 'app-fee-receipt-report',
  standalone: true,
  imports: [
    PageHeaderComponent,
    FilterBarComponent,
    PaginationComponent,
    CommonModule,
    FormsModule,
    IconComponent
  ],
  template: `
    <app-page-header
      title="Fees Receipt Report"
      icon="file-text"
      [breadcrumbs]="[{ label: 'Reports' }, { label: 'Fees Receipt Report' }]"
    >
      <button type="button" class="btn btn-primary" (click)="printReport()">
        <app-icon name="printer" [size]="16"></app-icon>
        <span>Print Report</span>
      </button>
    </app-page-header>

    <!-- Summary KPI cards -->
    <div class="form-grid-3" style="margin-bottom: 1.25rem;">
      <div class="card">
        <div class="card-body">
          <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">TOTAL RECEIPTS ISSUED</div>
          <h2 style="font-size: 1.5rem; font-weight: 700; color: var(--text-main); margin-top: 4px;">{{ filteredReceipts.length }}</h2>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">TOTAL COLLECTION AMOUNT</div>
          <h2 style="font-size: 1.5rem; font-weight: 700; color: var(--color-success); margin-top: 4px;">₹{{ totalAmount | number }}</h2>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">AVERAGE RECEIPT VALUE</div>
          <h2 style="font-size: 1.5rem; font-weight: 700; color: var(--color-primary); margin-top: 4px;">
            ₹{{ (filteredReceipts.length ? (totalAmount / filteredReceipts.length) : 0) | number:'1.0-0' }}
          </h2>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <app-filter-bar
      placeholder="Search by student name or receipt #..."
      (search)="onSearch($event)"
      (export)="exportData()"
    >
      <div filters class="filter-group">
        <select class="form-select" [(ngModel)]="selectedMode" (ngModelChange)="applyFilters()">
          <option value="">All Payment Modes</option>
          <option value="Cash">Cash</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="UPI">UPI</option>
          <option value="Cheque">Cheque</option>
        </select>

        <select class="form-select" [(ngModel)]="selectedBranch" (ngModelChange)="applyFilters()">
          <option value="">All Branches</option>
          <option *ngFor="let b of branches" [value]="b.name">{{ b.name }}</option>
        </select>
      </div>
    </app-filter-bar>

    <div class="card">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Receipt No</th>
              <th>Date</th>
              <th>Student ID</th>
              <th>Student Name</th>
              <th>Course</th>
              <th>Branch</th>
              <th>Payment Mode</th>
              <th>Ref No</th>
              <th style="text-align: right;">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let r of pagedReceipts">
              <td><strong>{{ r.receiptNo }}</strong></td>
              <td>{{ r.date }}</td>
              <td>{{ r.studentId }}</td>
              <td><strong>{{ r.studentName }}</strong></td>
              <td>{{ r.course }}</td>
              <td>{{ r.branch.split(' - ')[0] }}</td>
              <td><span class="badge badge-secondary">{{ r.paymentMode }}</span></td>
              <td>{{ r.referenceNo || '-' }}</td>
              <td style="text-align: right; font-weight: 700; color: var(--color-primary);">₹{{ r.amount | number }}</td>
            </tr>
            <tr *ngIf="filteredReceipts.length === 0">
              <td colspan="9" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                No receipts found for the selected criteria.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <app-pagination
        [totalItems]="filteredReceipts.length"
        [pageSize]="pageSize"
        [currentPage]="currentPage"
        (pageChange)="currentPage = $event"
      ></app-pagination>
    </div>
  `
})
export class FeeReceiptReportComponent implements OnInit {
  allReceipts: Receipt[] = [];
  filteredReceipts: Receipt[] = [];
  branches: Branch[] = [];

  searchTerm = '';
  selectedMode = '';
  selectedBranch = '';

  currentPage = 1;
  pageSize = 5;

  constructor(private mockDataService: MockDataService) {}

  ngOnInit() {
    this.mockDataService.getReceipts().subscribe(r => {
      this.allReceipts = r;
      this.applyFilters();
    });
    this.mockDataService.getBranches().subscribe(b => this.branches = b);
  }

  get totalAmount(): number {
    return this.filteredReceipts.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  }

  onSearch(term: string) {
    this.searchTerm = term.toLowerCase();
    this.applyFilters();
  }

  applyFilters() {
    this.filteredReceipts = this.allReceipts.filter(r => {
      const matchesSearch =
        !this.searchTerm ||
        r.studentName.toLowerCase().includes(this.searchTerm) ||
        r.receiptNo.toLowerCase().includes(this.searchTerm) ||
        r.course.toLowerCase().includes(this.searchTerm);

      const matchesMode = !this.selectedMode || r.paymentMode === this.selectedMode;
      const matchesBranch = !this.selectedBranch || r.branch === this.selectedBranch;

      return matchesSearch && matchesMode && matchesBranch;
    });
    this.currentPage = 1;
  }

  get pagedReceipts(): Receipt[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredReceipts.slice(start, start + this.pageSize);
  }

  printReport() {
    window.print();
  }

  exportData() {
    const csvContent = 'data:text/csv;charset=utf-8,' +
      'ReceiptNo,Date,StudentId,StudentName,Course,Branch,Mode,Amount\n' +
      this.filteredReceipts.map(r => `${r.receiptNo},${r.date},${r.studentId},"${r.studentName}","${r.course}","${r.branch}",${r.paymentMode},${r.amount}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Fee_Receipts_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
