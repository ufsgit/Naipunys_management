import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DataService, StudentListRow, Branch, DepartmentItem, UserRow, StatusItem, CourseItem } from '../../core/data.service';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="student-list-page">
      <h1 class="page-title">Student List</h1>

      <!-- Filter & Search Card -->
      <div class="filter-card">
        <!-- Row 1: Search Inputs + Advanced Search on Right Top -->
        <div class="filter-row-1">
          <div class="search-by-group">
            <span class="filter-label">Search by</span>
            <div class="search-combo">
              <select class="input-select select-field" [(ngModel)]="searchField">
                <option value="Name">Name</option>
                <option value="Mobile">Mobile</option>
                <option value="Note">Note</option>
              </select>
              <input
                type="text"
                class="input-text search-input"
                placeholder="Search..."
                [(ngModel)]="searchQuery"
                (keyup.enter)="applyFilters()"
              />
            </div>
          </div>

          <div class="enquiry-type-group">
            <span class="filter-label">Enquiry Type</span>
            <select class="input-select enquiry-select" [(ngModel)]="enquiryType">
              <option value="All">All</option>
              <option *ngFor="let t of enquiryTypes" [value]="t">{{ t }}</option>
            </select>
          </div>

          <div class="date-range-group">
            <label class="date-checkbox-label">
              <input type="checkbox" [(ngModel)]="dateFilterEnabled" />
              <span>Date</span>
            </label>
            <div class="date-inputs">
              <span class="date-label">From</span>
              <div class="date-input-wrap">
                <input type="text" class="input-text date-box" [(ngModel)]="fromDate" />
                <svg class="cal-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <span class="date-label">To</span>
              <div class="date-input-wrap">
                <input type="text" class="input-text date-box" [(ngModel)]="toDate" />
                <svg class="cal-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
            </div>

            <button type="button" class="btn-search-blue" (click)="applyFilters()">SEARCH</button>
          </div>

          <!-- Advanced Search placed at Right Top matching reference -->
          <button type="button" class="btn-advanced-blue" (click)="toggleAdvanced()">
            ADVANCED SEARCH
          </button>
        </div>

        <!-- Dropdown Selectors -->
        <div class="filter-row-3" *ngIf="showAdvanced">
          <div class="filter-col">
            <select class="input-select filter-select" [(ngModel)]="selectedBranch" (change)="applyFilters()">
              <option value="">All Branches</option>
              <option *ngFor="let b of branches" [value]="b.name">{{ b.name }}</option>
            </select>
          </div>

          <div class="filter-col">
            <select class="input-select filter-select" [(ngModel)]="selectedDept" (change)="applyFilters()">
              <option value="">All Departments</option>
              <option *ngFor="let d of departments" [value]="d.name">{{ d.name }}</option>
            </select>
          </div>

          <div class="filter-col">
            <select class="input-select filter-select" [(ngModel)]="selectedStatus" (change)="applyFilters()">
              <option value="">All Statuses</option>
              <option *ngFor="let s of statuses" [value]="s.name">{{ s.name }}</option>
            </select>
          </div>

          <div class="filter-col">
            <select class="input-select filter-select" [(ngModel)]="selectedStaff" (change)="applyFilters()">
              <option value="">All Staff</option>
              <option *ngFor="let u of staffOptions" [value]="u.userName">{{ u.userName }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Data Table Card with Dual Scroll Viewport -->
      <div class="table-card">
        <div class="table-scroll-container">
          <table class="naipunya-table">
            <thead>
              <tr class="table-header-row">
                <th class="col-sl">Sl No</th>
                <th class="col-name">Name</th>
                <th class="col-followup">FollowUp</th>
                <th class="col-note">Note</th>
                <th class="col-mobile">Mobile</th>
                <th class="col-remark">Remark</th>
                <th class="col-date">Next FollowUp</th>
                <th class="col-dept">Department</th>
                <th class="col-status">Status</th>
                <th class="col-to">To</th>
                <th class="col-from">From</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let s of filteredStudents">
                <td class="col-sl red-text">{{ s.slNo }}</td>
                <td class="col-name">
                  <a [routerLink]="['/students/detail', s.name]" [queryParams]="{ tab: 'details' }" class="blue-text-bold student-name-link">
                    {{ s.name }}
                  </a>
                </td>
                <td class="col-followup">
                  <a [routerLink]="['/students/detail', s.name]" [queryParams]="{ tab: 'followup' }" class="followup-link">
                    FollowUp
                  </a>
                </td>
                <td class="col-note dark-text">{{ s.note }}</td>
                <td class="col-mobile red-text">{{ s.mobile }}</td>
                <td class="col-remark red-text">{{ s.remark }}</td>
                <td class="col-date red-text">{{ s.nextFollowUp }}</td>
                <td class="col-dept red-text">{{ s.department }}</td>
                <td class="col-status red-text">{{ s.status }}</td>
                <td class="col-to red-text">{{ s.to }}</td>
                <td class="col-from red-text">{{ s.from }}</td>
              </tr>
              <tr *ngIf="filteredStudents.length === 0">
                <td colspan="11" class="text-center empty-state">No student records found matching the filter criteria.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Arrow Box -->
        <div class="pagination-footer">
          <div class="arrow-pager">
            <button type="button" class="pager-btn" (click)="prevPage()">&lt;</button>
            <button type="button" class="pager-btn" (click)="nextPage()">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .student-list-page {
      padding: 0.85rem 1.25rem 2rem 1.25rem;
      background-color: #f6f8fb;
      min-height: calc(100vh - 60px);
      font-family: inherit;
    }

    .page-title {
      font-size: 1.55rem;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 1.25rem;
      letter-spacing: -0.02em;
    }

    /* Filter Card */
    .filter-card {
      background: #ffffff;
      border: 1px solid #e5e9f2;
      border-radius: 8px;
      padding: 1.25rem 1.75rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
    }

    .filter-row-1 {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 1.25rem;
    }

    .search-by-group,
    .enquiry-type-group {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .filter-label {
      font-size: 0.82rem;
      font-weight: 500;
      color: #334155;
      white-space: nowrap;
    }

    .search-combo {
      display: flex;
      align-items: center;
    }

    .select-field {
      width: 90px;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right: none;
      background-color: #f8fafc;
    }

    .search-input {
      width: 170px;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }

    .enquiry-select {
      width: 110px;
    }

    .date-range-group {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .date-checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.82rem;
      font-weight: 600;
      color: #1e293b;
      cursor: pointer;
    }

    .date-inputs {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .date-label {
      font-size: 0.8rem;
      color: #475569;
    }

    .date-input-wrap {
      position: relative;
      display: inline-flex;
      align-items: center;
    }

    .date-box {
      width: 125px;
      padding: 0 1.75rem 0 0.6rem;
      text-align: left;
      font-size: 0.8rem;
      height: 34px;
      color: #1e293b;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
    }

    .cal-icon {
      position: absolute;
      right: 0.5rem;
      color: #64748b;
      pointer-events: none;
    }

    .btn-search-blue {
      background-color: #0b62b6;
      color: #ffffff;
      border: none;
      border-radius: 4px;
      padding: 0.45rem 1.4rem;
      font-size: 0.82rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      cursor: pointer;
      transition: background-color 0.15s;
    }

    .btn-search-blue:hover {
      background-color: #084d91;
    }

    /* Advanced Search Row matching Image 7 */
    .filter-row-adv {
      display: flex;
      justify-content: center;
      margin-top: 0.65rem;
    }

    .btn-advanced-blue {
      background-color: #0b62b6;
      color: #ffffff;
      border: none;
      border-radius: 4px;
      padding: 0.45rem 1.75rem;
      font-size: 0.8125rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      cursor: pointer;
      transition: background-color 0.15s;
      white-space: nowrap;
      margin-left: auto;
    }

    .btn-advanced-blue:hover {
      background-color: #084d91;
    }

    .filter-row-3 {
      display: flex;
      align-items: center;
      width: 100%;
      gap: 1.25rem;
      padding-top: 0.85rem;
      margin-top: 0.5rem;
      border-top: 1px dashed #cbd5e1;
      box-sizing: border-box;
    }

    .filter-col {
      flex: 1 1 0;
      min-width: 0;
      width: 100%;
      display: flex;
    }

    .filter-col .filter-select,
    .filter-select {
      width: 100% !important;
      min-width: 0 !important;
      box-sizing: border-box !important;
      height: 36px;
    }

    /* Common Input / Select */
    .input-text,
    .input-select {
      height: 34px;
      padding: 0.25rem 0.65rem;
      border: 1px solid #cbd5e1;
      border-radius: 5px;
      font-size: 0.82rem;
      color: #1e293b;
      background-color: #ffffff;
      outline: none;
      box-sizing: border-box;
    }

    .input-select {
      cursor: pointer;
    }

    /* Table Card */
    .table-card {
      background: #ffffff;
      border: 1px solid #e5e9f2;
      border-radius: 8px;
      padding: 0.85rem 1rem 1.25rem 1rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
    }

    /* Vertical & Horizontal Scroll Container - 8-9 rows visible initially, scroll down for remaining */
    .table-scroll-container {
      width: 100%;
      height: 380px;
      max-height: 380px;
      overflow-x: auto;
      overflow-y: auto;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      position: relative;
    }

    /* Distinct Windows-style scrollbars matching the video */
    .table-scroll-container::-webkit-scrollbar {
      width: 14px;
      height: 14px;
    }

    .table-scroll-container::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    .table-scroll-container::-webkit-scrollbar-thumb {
      background: #888888;
      border: 2px solid #f1f1f1;
      border-radius: 4px;
    }

    .table-scroll-container::-webkit-scrollbar-thumb:hover {
      background: #555555;
    }

    .table-scroll-container::-webkit-scrollbar-button {
      background-color: #e2e8f0;
      display: block;
      height: 14px;
      width: 14px;
    }

    .naipunya-table {
      width: 100%;
      min-width: 1750px;
      border-collapse: separate;
      border-spacing: 0;
      font-size: 0.92rem;
    }

    /* Blue Table Header matching screenshot - Sticky on top */
    .table-header-row {
      background-color: #0b62b6;
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .naipunya-table thead th {
      text-align: left;
      font-weight: 700;
      color: #ffffff;
      padding: 0.75rem 0.95rem;
      font-size: 0.95rem;
      white-space: nowrap;
      border-bottom: 1px solid #0b62b6;
      background-color: #0b62b6;
    }

    .naipunya-table tbody td {
      padding: 0.65rem 0.95rem;
      border-bottom: 1px solid #e5e7eb;
      font-size: 0.92rem;
      vertical-align: middle;
      white-space: nowrap;
      background-color: #ffffff;
    }

    .naipunya-table tbody tr:hover td {
      background-color: #f8fafc;
    }

    /* Spacious neat column widths matching reference */
    .col-sl { width: 65px; min-width: 65px; text-align: center; }
    .col-name { width: 250px; min-width: 250px; }
    .col-followup { width: 110px; min-width: 110px; }
    .col-note { width: 210px; min-width: 210px; }
    .col-mobile { width: 150px; min-width: 150px; }
    .col-remark { width: 210px; min-width: 210px; }
    .col-date { width: 150px; min-width: 150px; }
    .col-dept { width: 150px; min-width: 150px; }
    .col-status { width: 135px; min-width: 135px; }
    .col-to { width: 125px; min-width: 125px; }
    .col-from { width: 125px; min-width: 125px; }

    /* Custom Colors with increased text size */
    .red-text {
      color: #dc2626;
      font-weight: 600;
      font-size: 0.92rem;
    }

    .blue-text-bold {
      color: #0b62b6;
      font-weight: 700;
      letter-spacing: 0.01em;
      font-size: 0.92rem;
    }

    .student-name-link {
      text-decoration: none;
      cursor: pointer;
    }

    .student-name-link:hover {
      text-decoration: underline;
    }

    .dark-text {
      color: #1e293b;
      font-weight: 500;
      font-size: 0.92rem;
    }

    .followup-link {
      color: #0b62b6;
      font-weight: 700;
      font-size: 0.92rem;
      text-decoration: none;
      cursor: pointer;
    }

    .followup-link:hover {
      text-decoration: underline;
    }

    .empty-state {
      padding: 2rem !important;
      color: #64748b;
      font-style: italic;
    }

    .loading-state {
      padding: 3rem !important;
      color: #64748b;
      font-style: italic;
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

    /* Pager footer */
    .pagination-footer {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      margin-top: 1.25rem;
    }

    .arrow-pager {
      display: inline-flex;
      align-items: center;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      overflow: hidden;
    }

    .pager-btn {
      background: #ffffff;
      border: none;
      padding: 0.3rem 0.85rem;
      font-size: 0.85rem;
      color: #334155;
      cursor: pointer;
      transition: background-color 0.15s;
    }

    .pager-btn:first-child {
      border-right: 1px solid #cbd5e1;
    }

    .pager-btn:hover {
      background-color: #f1f5f9;
    }

    @media (max-width: 1024px) {
      .filter-row-1 {
        flex-direction: column;
        align-items: flex-start;
      }
      .filter-row-3 {
        flex-wrap: wrap;
      }
      .filter-col {
        min-width: 200px;
      }
    }
  `]
})
export class StudentListComponent implements OnInit {
  searchField = 'Name';
  searchQuery = '';
  enquiryType = 'All';
  dateFilterEnabled = true;
  fromDate = '';
  toDate = '';

  showAdvanced = false;
  selectedBranch = '';
  selectedDept = '';
  selectedStatus = '';
  selectedStaff = '';

  branches: Branch[] = [];
  departments: DepartmentItem[] = [];
  staffOptions: UserRow[] = [];
  statuses: StatusItem[] = [];
  enquiryTypes: string[] = ['COURSE', 'RECRUITMENT', 'STUDY'];

  allStudents: StudentListRow[] = [];
  filteredStudents: StudentListRow[] = [];

  constructor(private mockDataService: DataService) {}

  ngOnInit() {
    this.mockDataService.fetchStudents().subscribe({
      next: data => {
        this.allStudents = data || [];
        this.applyFilters();
      },
      error: err => {
        console.error('[StudentList] load failed:', err);
        this.allStudents = [];
        this.applyFilters();
      }
    });
    this.mockDataService.getBranches().subscribe(b => this.branches = b);
    this.mockDataService.getDepartmentItems().subscribe(d => this.departments = d);
    this.mockDataService.getUserRows().subscribe(u => this.staffOptions = u);
    this.mockDataService.getStatusSettingsItems().subscribe(s => this.statuses = s);
    this.mockDataService.getEnquiryTypes().subscribe(t => {
      this.enquiryTypes = t;
    });
  }

  toggleAdvanced() {
    this.showAdvanced = !this.showAdvanced;
  }

  applyFilters() {
    const q = this.searchQuery.toLowerCase().trim();

    this.filteredStudents = this.allStudents.filter(s => {
      if (q) {
        if (this.searchField === 'Name' && !s.name.toLowerCase().includes(q)) return false;
        if (this.searchField === 'Mobile' && !s.mobile.includes(q)) return false;
        if (this.searchField === 'Note' && !s.note.toLowerCase().includes(q)) return false;
      }
      if (this.enquiryType && this.enquiryType !== 'All' && (s.enquiryType || '').toUpperCase() !== this.enquiryType.toUpperCase()) return false;
      if (this.selectedBranch && s.branch !== this.selectedBranch) return false;
      if (this.selectedDept && s.department !== this.selectedDept) return false;
      if (this.selectedStatus && s.status !== this.selectedStatus) return false;
      if (this.selectedStaff && s.to !== this.selectedStaff) return false;
      return true;
    });
  }

  prevPage() {
    // Interactive mock pager
  }

  nextPage() {
    // Interactive mock pager
  }
}
