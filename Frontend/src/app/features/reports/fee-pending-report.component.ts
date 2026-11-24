import { IconComponent, ModalComponent, ConfirmDialogComponent, PageHeaderComponent, PaginationComponent, FilterBarComponent } from '../../shared/index';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MockDataService, Student, Course, Branch } from '../../core/mock-data.service';

@Component({
  selector: 'app-fee-pending-report',
  standalone: true,
  imports: [
    PageHeaderComponent,
    FilterBarComponent,
    PaginationComponent,
    CommonModule,
    FormsModule,
    RouterModule,
    IconComponent
  ],
  template: `
    <app-page-header
      title="Fees Pending Report"
      icon="clock"
      [breadcrumbs]="[{ label: 'Reports' }, { label: 'Fees Pending Report' }]"
    >
      <button type="button" class="btn btn-primary" (click)="printReport()">
        <app-icon name="printer" [size]="16"></app-icon>
        <span>Print Pending Dues</span>
      </button>
    </app-page-header>

    <!-- Total Pending Dues Banner -->
    <div class="form-grid-3" style="margin-bottom: 1.25rem;">
      <div class="card">
        <div class="card-body">
          <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">STUDENTS WITH PENDING DUES</div>
          <h2 style="font-size: 1.5rem; font-weight: 700; color: var(--text-main); margin-top: 4px;">{{ filteredStudents.length }}</h2>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">TOTAL PENDING RECEIVABLES</div>
          <h2 style="font-size: 1.5rem; font-weight: 700; color: var(--color-danger); margin-top: 4px;">₹{{ totalPendingAmount | number }}</h2>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">OVERALL COLLECTION RATE</div>
          <h2 style="font-size: 1.5rem; font-weight: 700; color: var(--color-primary); margin-top: 4px;">{{ collectionRate }}%</h2>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <app-filter-bar
      placeholder="Search by student name, code, phone or course..."
      (search)="onSearch($event)"
      (export)="exportData()"
    >
      <div filters class="filter-group">
        <select class="form-select" [(ngModel)]="selectedCourse" (ngModelChange)="applyFilters()">
          <option value="">All Courses</option>
          <option *ngFor="let c of courses" [value]="c.name">{{ c.name }}</option>
        </select>

        <select class="form-select" [(ngModel)]="selectedBranch" (ngModelChange)="applyFilters()">
          <option value="">All Branches</option>
          <option *ngFor="let b of branches" [value]="b.name">{{ b.name }}</option>
        </select>
      </div>
    </app-filter-bar>

    <!-- Table of Pending Dues -->
    <div class="card">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Student Code</th>
              <th>Student Name</th>
              <th>Contact Phone</th>
              <th>Course</th>
              <th>Branch</th>
              <th style="text-align: right;">Total Fee</th>
              <th style="text-align: right;">Paid Amount</th>
              <th style="text-align: right;">Pending Due (₹)</th>
              <th style="text-align: right;">Quick Action</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let s of pagedStudents; let i = index">
              <td>{{ (currentPage - 1) * pageSize + i + 1 }}</td>
              <td><strong>{{ s.code }}</strong></td>
              <td>
                <div style="font-weight: 600;">{{ s.name }}</div>
                <small style="color: var(--text-muted);">{{ s.email }}</small>
              </td>
              <td>{{ s.phone }}</td>
              <td>{{ s.course }}</td>
              <td>{{ s.branch.split(' - ')[0] }}</td>
              <td style="text-align: right;">₹{{ s.feesTotal | number }}</td>
              <td style="text-align: right; color: var(--color-success);">₹{{ s.feesPaid | number }}</td>
              <td style="text-align: right; font-weight: 700; color: var(--color-danger); font-size: 1rem;">
                ₹{{ (s.feesTotal - s.feesPaid) | number }}
              </td>
              <td style="text-align: right;">
                <a routerLink="/receipts" class="btn btn-sm btn-outline-primary">
                  <app-icon name="receipt" [size]="14"></app-icon>
                  <span>Collect Fee</span>
                </a>
              </td>
            </tr>
            <tr *ngIf="filteredStudents.length === 0">
              <td colspan="10" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                Great! No pending fees matching your criteria.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <app-pagination
        [totalItems]="filteredStudents.length"
        [pageSize]="pageSize"
        [currentPage]="currentPage"
        (pageChange)="currentPage = $event"
      ></app-pagination>
    </div>
  `
})
export class FeePendingReportComponent implements OnInit {
  allStudents: Student[] = [];
  filteredStudents: Student[] = [];
  courses: Course[] = [];
  branches: Branch[] = [];

  searchTerm = '';
  selectedCourse = '';
  selectedBranch = '';

  currentPage = 1;
  pageSize = 5;

  constructor(private mockDataService: MockDataService) {}

  ngOnInit() {
    this.mockDataService.getStudents().subscribe(students => {
      this.allStudents = students;
      this.applyFilters();
    });
    this.mockDataService.getCourses().subscribe(c => this.courses = c);
    this.mockDataService.getBranches().subscribe(b => this.branches = b);
  }

  get totalPendingAmount(): number {
    return this.filteredStudents.reduce((acc, curr) => acc + (curr.feesTotal - curr.feesPaid), 0);
  }

  get collectionRate(): number {
    const total = this.allStudents.reduce((acc, curr) => acc + curr.feesTotal, 0);
    const paid = this.allStudents.reduce((acc, curr) => acc + curr.feesPaid, 0);
    return total ? Math.round((paid / total) * 100) : 100;
  }

  onSearch(term: string) {
    this.searchTerm = term.toLowerCase();
    this.applyFilters();
  }

  applyFilters() {
    this.filteredStudents = this.allStudents.filter(s => {
      const isPending = (s.feesTotal - s.feesPaid) > 0;
      const matchesSearch =
        !this.searchTerm ||
        s.name.toLowerCase().includes(this.searchTerm) ||
        s.code.toLowerCase().includes(this.searchTerm) ||
        s.phone.includes(this.searchTerm) ||
        s.course.toLowerCase().includes(this.searchTerm);

      const matchesCourse = !this.selectedCourse || s.course === this.selectedCourse;
      const matchesBranch = !this.selectedBranch || s.branch === this.selectedBranch;

      return isPending && matchesSearch && matchesCourse && matchesBranch;
    });
    this.currentPage = 1;
  }

  get pagedStudents(): Student[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredStudents.slice(start, start + this.pageSize);
  }

  printReport() {
    window.print();
  }

  exportData() {
    const csvContent = 'data:text/csv;charset=utf-8,' +
      'Code,Name,Phone,Course,Branch,FeeTotal,FeePaid,PendingDue\n' +
      this.filteredStudents.map(s => `${s.code},"${s.name}",${s.phone},"${s.course}","${s.branch}",${s.feesTotal},${s.feesPaid},${s.feesTotal - s.feesPaid}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Fee_Pending_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
