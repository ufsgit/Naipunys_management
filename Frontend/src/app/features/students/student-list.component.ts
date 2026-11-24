import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MockDataService } from '../../core/mock-data.service';

interface StudentListRow {
  slNo: number;
  name: string;
  note: string;
  mobile: string;
  remark: string;
  nextFollowUp: string;
  department: string;
  status: string;
  to: string;
  from: string;
}

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="student-list-page">
      <h1 class="page-title">Student List</h1>

      <!-- Filter & Search Card -->
      <div class="filter-card">
        <!-- Row 1: Search Inputs -->
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
              <option value="Course Enquiry">Course Enquiry</option>
              <option value="Visa Enquiry">Visa Enquiry</option>
              <option value="IELTS / OET">IELTS / OET</option>
            </select>
          </div>

          <div class="date-range-group">
            <label class="date-checkbox-label">
              <input type="checkbox" [(ngModel)]="dateFilterEnabled" />
              <span>Date</span>
            </label>
            <div class="date-inputs">
              <span class="date-label">From</span>
              <input type="text" class="input-text date-box" [(ngModel)]="fromDate" />
              <span class="date-label">To</span>
              <input type="text" class="input-text date-box" [(ngModel)]="toDate" />
            </div>
          </div>

          <button type="button" class="btn-search-blue" (click)="applyFilters()">SEARCH</button>
        </div>

        <!-- Row 2: Advanced Search Button -->
        <div class="filter-row-2">
          <button type="button" class="btn-advanced-purple" (click)="toggleAdvanced()">
            ADVANCED SEARCH
          </button>
        </div>

        <!-- Row 3: Dropdown Selectors -->
        <div class="filter-row-3" *ngIf="showAdvanced">
          <div class="filter-col">
            <select class="input-select filter-select" [(ngModel)]="selectedBranch" (change)="applyFilters()">
              <option value="All Branches">All Branches</option>
              <option value="Ernakulam">Ernakulam</option>
              <option value="Kottayam">Kottayam</option>
              <option value="Thrissur">Thrissur</option>
              <option value="Calicut">Calicut</option>
            </select>
          </div>

          <div class="filter-col">
            <select class="input-select filter-select" [(ngModel)]="selectedDept" (change)="applyFilters()">
              <option value="All Departments">All Departments</option>
              <option value="Admission">Admission</option>
              <option value="Follow Up">Follow Up</option>
              <option value="IELTS Academic">IELTS Academic</option>
            </select>
          </div>

          <div class="filter-col">
            <select class="input-select filter-select" [(ngModel)]="selectedStatus" (change)="applyFilters()">
              <option value="All Statuses">All Statuses</option>
              <option value="Interested">Interested</option>
              <option value="Running">Running</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div class="filter-col">
            <select class="input-select filter-select" [(ngModel)]="selectedStaff" (change)="applyFilters()">
              <option value="All Staff">All Staff</option>
              <option value="DIVYA">DIVYA</option>
              <option value="DIRECTOR">DIRECTOR</option>
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
                <td class="col-name blue-text-bold">{{ s.name }}</td>
                <td class="col-followup">
                  <a routerLink="/students/follow-up" class="followup-link">FollowUp</a>
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
          <div class="copyright-caption">By UFS Technologies</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .student-list-page {
      padding: 1.25rem 2rem 3rem 2rem;
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
      gap: 1.5rem;
      margin-bottom: 0.85rem;
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
      gap: 0.6rem;
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
      gap: 0.4rem;
    }

    .date-label {
      font-size: 0.8rem;
      color: #475569;
    }

    .date-box {
      width: 105px;
      text-align: center;
      font-size: 0.8rem;
    }

    .btn-search-blue {
      background-color: #1d4ed8;
      color: #ffffff;
      border: none;
      border-radius: 6px;
      padding: 0.45rem 1.35rem;
      font-size: 0.82rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      cursor: pointer;
      transition: background-color 0.15s;
    }

    .btn-search-blue:hover {
      background-color: #1e40af;
    }

    .filter-row-2 {
      margin-bottom: 1rem;
    }

    .btn-advanced-purple {
      background-color: #7c3aed;
      color: #ffffff;
      border: none;
      border-radius: 6px;
      padding: 0.4rem 1.1rem;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      cursor: pointer;
      transition: background-color 0.15s;
    }

    .btn-advanced-purple:hover {
      background-color: #6d28d9;
    }

    .filter-row-3 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.25rem;
      padding-top: 0.5rem;
      border-top: 1px dashed #e2e8f0;
    }

    .filter-col .filter-select {
      width: 100%;
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
      padding: 1.25rem 1.75rem 2rem 1.75rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
    }

    /* Vertical & Horizontal Scroll Container */
    .table-scroll-container {
      width: 100%;
      height: 380px;
      max-height: 380px;
      overflow-x: scroll;
      overflow-y: scroll;
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
      width: max-content;
      min-width: 1650px;
      border-collapse: separate;
      border-spacing: 0;
      font-size: 0.84rem;
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
      font-weight: 600;
      color: #ffffff;
      padding: 0.75rem 0.75rem;
      font-size: 0.82rem;
      white-space: nowrap;
      border-bottom: 1px solid #0b62b6;
      background-color: #0b62b6;
    }

    .naipunya-table tbody td {
      padding: 0.75rem 0.75rem;
      border-bottom: 1px solid #e5e7eb;
      font-size: 0.82rem;
      vertical-align: middle;
      white-space: nowrap;
      background-color: #ffffff;
    }

    .naipunya-table tbody tr:hover td {
      background-color: #f9fafb;
    }

    .col-sl { width: 45px; }
    .col-name { min-width: 210px; }
    .col-followup { width: 90px; }
    .col-note { min-width: 160px; }
    .col-mobile { width: 115px; }
    .col-remark { min-width: 160px; }
    .col-date { width: 110px; }
    .col-dept { width: 110px; }
    .col-status { width: 110px; }
    .col-to { width: 80px; }
    .col-from { width: 80px; }

    /* Custom Colors matching reference screenshot */
    .red-text {
      color: #dc2626;
      font-weight: 500;
    }

    .blue-text-bold {
      color: #2563eb;
      font-weight: 600;
      letter-spacing: 0.01em;
    }

    .dark-text {
      color: #1e293b;
      font-weight: 500;
    }

    .followup-link {
      color: #2563eb;
      font-weight: 500;
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

    /* Pager footer */
    .pagination-footer {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.6rem;
      margin-top: 1.5rem;
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

    .copyright-caption {
      font-size: 0.72rem;
      color: #64748b;
    }

    @media (max-width: 1024px) {
      .filter-row-1 {
        flex-direction: column;
        align-items: flex-start;
      }
      .filter-row-3 {
        grid-template-columns: 1fr 1fr;
      }
    }
  `]
})
export class StudentListComponent implements OnInit {
  searchField = 'Name';
  searchQuery = '';
  enquiryType = 'All';
  dateFilterEnabled = true;
  fromDate = '01-Aug-2026';
  toDate = '24-Nov-2026';

  showAdvanced = true;
  selectedBranch = 'All Branches';
  selectedDept = 'All Departments';
  selectedStatus = 'All Statuses';
  selectedStaff = 'All Staff';

  allStudents: StudentListRow[] = [
    {
      slNo: 1,
      name: 'JUSTIN K G',
      note: 'IELTS 1 MONTH',
      mobile: '9995914160',
      remark: 'IELTS 1 MONTH',
      nextFollowUp: '24-Nov-2026',
      department: 'Admission',
      status: 'Interested',
      to: 'DIVYA',
      from: 'DIVYA'
    },
    {
      slNo: 2,
      name: 'PRIYANKA CLEMENT',
      note: 'NICE',
      mobile: '8891460293',
      remark: 'NICE',
      nextFollowUp: '19-Nov-2026',
      department: 'Admission',
      status: 'Interested',
      to: 'DIVYA',
      from: 'DIVYA'
    },
    {
      slNo: 3,
      name: 'ROBBIN CHIRACKAL JOSEPH',
      note: 'IELTS 1 MONTH',
      mobile: '9895162325',
      remark: 'IELTS 1 MONTH',
      nextFollowUp: '19-Oct-2026',
      department: 'Admission',
      status: 'Interested',
      to: 'DIVYA',
      from: 'DIVYA'
    },
    {
      slNo: 4,
      name: 'ANJANA BINDHU',
      note: 'UK VISITING VISA',
      mobile: '9544669647',
      remark: 'UK VISITING VISA',
      nextFollowUp: '13-Oct-2026',
      department: 'Admission',
      status: 'Interested',
      to: 'DIVYA',
      from: 'DIVYA'
    },
    {
      slNo: 5,
      name: 'AWIN SANTHOSH',
      note: 'NZ DEPENDENT VISA',
      mobile: '9072933600',
      remark: 'NZ DEPENDENT VISA',
      nextFollowUp: '10-Oct-2026',
      department: 'Admission',
      status: 'Interested',
      to: 'DIVYA',
      from: 'DIVYA'
    },
    {
      slNo: 6,
      name: 'FR. BENNY VARGHESE THOPPIPARAMBIL',
      note: 'IELTS 1 MONTH',
      mobile: '7025714977',
      remark: 'IELTS 1 MONTH',
      nextFollowUp: '05-Oct-2026',
      department: 'Admission',
      status: 'Interested',
      to: 'DIVYA',
      from: 'DIVYA'
    },
    {
      slNo: 7,
      name: 'MIKAH SUBIN ARACKAL',
      note: 'UK DEPENDENT VISA',
      mobile: '8593956865',
      remark: 'UK DEPENDENT VISA',
      nextFollowUp: '14-Sep-2026',
      department: 'Admission',
      status: 'Interested',
      to: 'DIVYA',
      from: 'DIVYA'
    },
    {
      slNo: 8,
      name: 'MARIAN JOSEPH ARACKAL',
      note: 'IELTS 1 MONTH',
      mobile: '9447617828',
      remark: 'IELTS 1 MONTH',
      nextFollowUp: '07-Sep-2026',
      department: 'Admission',
      status: 'Interested',
      to: 'DIVYA',
      from: 'DIVYA'
    },
    {
      slNo: 9,
      name: 'EMMANUEL CHRISTIE BENHAR',
      note: 'IELTS 3 MONTHS',
      mobile: '9072070780',
      remark: 'IELTS 3 MONTHS',
      nextFollowUp: '31-Aug-2026',
      department: 'Admission',
      status: 'Interested',
      to: 'DIVYA',
      from: 'DIVYA'
    },
    {
      slNo: 10,
      name: 'LAKSHMI N BIJU',
      note: 'IELTS 1 MONTH EXTN',
      mobile: '8075863539',
      remark: 'IELTS 1 MONTH EXTN',
      nextFollowUp: '31-Aug-2026',
      department: 'Admission',
      status: 'Interested',
      to: 'DIVYA',
      from: 'DIVYA'
    },
    {
      slNo: 11,
      name: 'ALFIN SHINIL',
      note: 'IELTS 2 MONTH',
      mobile: '8330055882',
      remark: 'IELTS 2 MONTH',
      nextFollowUp: '31-Aug-2026',
      department: 'Admission',
      status: 'Interested',
      to: 'DIVYA',
      from: 'DIVYA'
    },
    {
      slNo: 12,
      name: 'MANUEL VATTISERRY VARGHESE',
      note: 'GERMANY',
      mobile: '6238209350',
      remark: 'GERMANY',
      nextFollowUp: '29-Aug-2026',
      department: 'Admission',
      status: 'Interested',
      to: 'DIVYA',
      from: 'DIVYA'
    },
    {
      slNo: 13,
      name: 'SHARON PUTHENPURAKKAL JOSEPH',
      note: 'GERMANY',
      mobile: '9037068928',
      remark: 'GERMANY',
      nextFollowUp: '17-Aug-2026',
      department: 'Admission',
      status: 'Interested',
      to: 'DIVYA',
      from: 'DIVYA'
    },
    {
      slNo: 14,
      name: 'Rahan Jude',
      note: 'IELTS 1 MONTH',
      mobile: '7994241436',
      remark: 'IELTS 1 MONTH',
      nextFollowUp: '17-Aug-2026',
      department: 'Admission',
      status: 'Interested',
      to: 'DIVYA',
      from: 'DIVYA'
    },
    {
      slNo: 15,
      name: 'AKHIL BABU',
      note: 'GERMANY',
      mobile: '7034653432',
      remark: 'GERMANY',
      nextFollowUp: '14-Aug-2026',
      department: 'Admission',
      status: 'Interested',
      to: 'DIVYA',
      from: 'DIVYA'
    }
  ];

  filteredStudents: StudentListRow[] = [];

  constructor(private mockDataService: MockDataService) {}

  ngOnInit() {
    this.filteredStudents = [...this.allStudents];
  }

  toggleAdvanced() {
    this.showAdvanced = !this.showAdvanced;
  }

  applyFilters() {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) {
      this.filteredStudents = [...this.allStudents];
      return;
    }

    this.filteredStudents = this.allStudents.filter(s => {
      if (this.searchField === 'Name') return s.name.toLowerCase().includes(q);
      if (this.searchField === 'Mobile') return s.mobile.includes(q);
      if (this.searchField === 'Note') return s.note.toLowerCase().includes(q);
      return s.name.toLowerCase().includes(q) || s.mobile.includes(q);
    });
  }

  prevPage() {
    // Interactive mock pager
  }

  nextPage() {
    // Interactive mock pager
  }
}
