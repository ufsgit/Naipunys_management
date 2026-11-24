import { IconComponent, ModalComponent, ConfirmDialogComponent, PageHeaderComponent, PaginationComponent, FilterBarComponent } from '../../shared/index';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService, StudentFollowUp, Student, SettingItem } from '../../core/mock-data.service';

@Component({
  selector: 'app-student-followup',
  standalone: true,
  imports: [
    PageHeaderComponent,
    FilterBarComponent,
    PaginationComponent,
    CommonModule,
    FormsModule,
    ModalComponent,
    ConfirmDialogComponent,
    IconComponent
  ],
  template: `
    <app-page-header
      title="Student Follow-up Management"
      icon="activity"
      [breadcrumbs]="[{ label: 'Student Management' }, { label: 'Student Follow-up' }]"
    >
      <button type="button" class="btn btn-primary" (click)="openAddModal()">
        <app-icon name="plus" [size]="16"></app-icon>
        <span>Add Follow-up Log</span>
      </button>
    </app-page-header>

    <!-- Filters -->
    <app-filter-bar
      placeholder="Search follow-ups by student name, remark or phone..."
      (search)="onSearch($event)"
      (export)="exportData()"
    >
      <div filters class="filter-group">
        <select class="form-select" [(ngModel)]="selectedStatus" (ngModelChange)="applyFilters()">
          <option value="">All Statuses</option>
          <option value="Open">Open</option>
          <option value="Converted">Converted</option>
          <option value="Closed">Closed</option>
        </select>

        <select class="form-select" [(ngModel)]="selectedType" (ngModelChange)="applyFilters()">
          <option value="">All Follow-up Types</option>
          <option *ngFor="let t of followupTypes" [value]="t.name">{{ t.name }}</option>
        </select>
      </div>
    </app-filter-bar>

    <!-- Followup Table -->
    <div class="card">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Student Name</th>
              <th>Course</th>
              <th>Follow-up Date</th>
              <th>Type</th>
              <th>Source</th>
              <th>Discussion / Remark</th>
              <th>Next Follow-up</th>
              <th>Status</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of pagedItems; let i = index">
              <td>{{ (currentPage - 1) * pageSize + i + 1 }}</td>
              <td>
                <div style="font-weight: 600;">{{ item.studentName }}</div>
                <small style="color: var(--text-muted);">{{ item.phone }}</small>
              </td>
              <td>{{ item.course }}</td>
              <td>{{ item.date }}</td>
              <td><span class="badge badge-secondary">{{ item.type }}</span></td>
              <td>{{ item.enquirySource }}</td>
              <td style="max-width: 250px;">{{ item.remark }}</td>
              <td><strong>{{ item.nextFollowUpDate }}</strong></td>
              <td>
                <span
                  class="badge"
                  [ngClass]="{
                    'badge-warning': item.status === 'Open',
                    'badge-success': item.status === 'Converted',
                    'badge-secondary': item.status === 'Closed'
                  }"
                >
                  {{ item.status }}
                </span>
              </td>
              <td style="text-align: right;">
                <div class="table-actions" style="justify-content: flex-end;">
                  <button type="button" class="btn btn-sm btn-secondary" (click)="openEditModal(item)" title="Edit">
                    <app-icon name="edit" [size]="14"></app-icon>
                  </button>
                  <button type="button" class="btn btn-sm btn-danger" (click)="openDeleteConfirm(item)" title="Delete">
                    <app-icon name="trash-2" [size]="14"></app-icon>
                  </button>
                </div>
              </td>
            </tr>
            <tr *ngIf="filteredItems.length === 0">
              <td colspan="10" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                No follow-up records found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <app-pagination
        [totalItems]="filteredItems.length"
        [pageSize]="pageSize"
        [currentPage]="currentPage"
        (pageChange)="currentPage = $event"
      ></app-pagination>
    </div>

    <!-- Add / Edit Modal -->
    <app-modal
      [isOpen]="isModalOpen"
      [title]="isEditMode ? 'Edit Follow-up Log' : 'Create New Student Follow-up'"
      (closeEvent)="isModalOpen = false"
      (confirmEvent)="saveFollowup()"
    >
      <div modal-body>
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label required">Student</label>
            <select class="form-select" [(ngModel)]="currentForm.studentName" (ngModelChange)="onStudentSelect($event)">
              <option value="" disabled>-- Select Student --</option>
              <option *ngFor="let s of students" [value]="s.name">{{ s.name }} ({{ s.code }})</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label required">Phone</label>
            <input type="text" class="form-control" [(ngModel)]="currentForm.phone" placeholder="Phone" />
          </div>

          <div class="form-group">
            <label class="form-label required">Course</label>
            <input type="text" class="form-control" [(ngModel)]="currentForm.course" placeholder="Course name" />
          </div>

          <div class="form-group">
            <label class="form-label required">Follow-up Type</label>
            <select class="form-select" [(ngModel)]="currentForm.type">
              <option *ngFor="let t of followupTypes" [value]="t.name">{{ t.name }}</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label required">Enquiry Source</label>
            <select class="form-select" [(ngModel)]="currentForm.enquirySource">
              <option *ngFor="let s of enquirySources" [value]="s.name">{{ s.name }}</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label required">Log Date</label>
            <input type="date" class="form-control" [(ngModel)]="currentForm.date" />
          </div>

          <div class="form-group">
            <label class="form-label required">Next Follow-up Date</label>
            <input type="date" class="form-control" [(ngModel)]="currentForm.nextFollowUpDate" />
          </div>

          <div class="form-group">
            <label class="form-label required">Status</label>
            <select class="form-select" [(ngModel)]="currentForm.status">
              <option value="Open">Open</option>
              <option value="Converted">Converted</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div class="form-group full-width">
            <label class="form-label required">Follow-up Remark / Discussion Notes</label>
            <textarea class="form-textarea" [(ngModel)]="currentForm.remark" rows="3" placeholder="Enter details of conversation..."></textarea>
          </div>
        </div>
      </div>
    </app-modal>

    <!-- Delete Confirmation Dialog -->
    <app-confirm-dialog
      [isOpen]="isDeleteModalOpen"
      title="Delete Follow-up Log"
      message="Are you sure you want to remove this follow-up record?"
      (confirmEvent)="confirmDelete()"
      (cancelEvent)="isDeleteModalOpen = false"
    ></app-confirm-dialog>
  `
})
export class StudentFollowupComponent implements OnInit {
  allItems: StudentFollowUp[] = [];
  filteredItems: StudentFollowUp[] = [];
  students: Student[] = [];
  followupTypes: SettingItem[] = [];
  enquirySources: SettingItem[] = [];

  searchTerm = '';
  selectedStatus = '';
  selectedType = '';

  currentPage = 1;
  pageSize = 5;

  isModalOpen = false;
  isEditMode = false;
  isDeleteModalOpen = false;
  itemToDelete: StudentFollowUp | null = null;

  currentForm = {
    id: '',
    studentId: '',
    studentName: '',
    phone: '',
    course: '',
    date: new Date().toISOString().slice(0, 10),
    type: 'Phone Call',
    enquirySource: 'Direct Walk-in',
    remark: '',
    nextFollowUpDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
    status: 'Open' as 'Open' | 'Converted' | 'Closed'
  };

  constructor(private mockDataService: MockDataService) {}

  ngOnInit() {
    this.mockDataService.getFollowUps().subscribe(items => {
      this.allItems = items;
      this.applyFilters();
    });
    this.mockDataService.getStudents().subscribe(s => this.students = s);
    this.mockDataService.getFollowupTypes().subscribe(t => this.followupTypes = t);
    this.mockDataService.getEnquirySources().subscribe(e => this.enquirySources = e);
  }

  onStudentSelect(studentName: string) {
    const student = this.students.find(s => s.name === studentName);
    if (student) {
      this.currentForm.studentId = student.code;
      this.currentForm.phone = student.phone;
      this.currentForm.course = student.course;
    }
  }

  onSearch(term: string) {
    this.searchTerm = term.toLowerCase();
    this.applyFilters();
  }

  applyFilters() {
    this.filteredItems = this.allItems.filter(item => {
      const matchesSearch =
        !this.searchTerm ||
        item.studentName.toLowerCase().includes(this.searchTerm) ||
        item.phone.includes(this.searchTerm) ||
        item.remark.toLowerCase().includes(this.searchTerm);

      const matchesStatus = !this.selectedStatus || item.status === this.selectedStatus;
      const matchesType = !this.selectedType || item.type === this.selectedType;

      return matchesSearch && matchesStatus && matchesType;
    });
    this.currentPage = 1;
  }

  get pagedItems(): StudentFollowUp[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredItems.slice(start, start + this.pageSize);
  }

  openAddModal() {
    this.isEditMode = false;
    this.currentForm = {
      id: '',
      studentId: '',
      studentName: '',
      phone: '',
      course: '',
      date: new Date().toISOString().slice(0, 10),
      type: this.followupTypes[0]?.name || 'Phone Call',
      enquirySource: this.enquirySources[0]?.name || 'Direct Walk-in',
      remark: '',
      nextFollowUpDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      status: 'Open'
    };
    this.isModalOpen = true;
  }

  openEditModal(item: StudentFollowUp) {
    this.isEditMode = true;
    this.currentForm = { ...item };
    this.isModalOpen = true;
  }

  saveFollowup() {
    if (this.isEditMode) {
      this.mockDataService.updateFollowUp(this.currentForm.id, this.currentForm);
    } else {
      this.mockDataService.addFollowUp(this.currentForm);
    }
    this.isModalOpen = false;
  }

  openDeleteConfirm(item: StudentFollowUp) {
    this.itemToDelete = item;
    this.isDeleteModalOpen = true;
  }

  confirmDelete() {
    if (this.itemToDelete) {
      this.mockDataService.deleteFollowUp(this.itemToDelete.id);
      this.isDeleteModalOpen = false;
      this.itemToDelete = null;
    }
  }

  exportData() {
    const csvContent = 'data:text/csv;charset=utf-8,' +
      'Student,Phone,Course,Date,Type,Source,Remark,NextDate,Status\n' +
      this.filteredItems.map(f => `"${f.studentName}",${f.phone},"${f.course}",${f.date},"${f.type}","${f.enquirySource}","${f.remark}",${f.nextFollowUpDate},${f.status}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Followups_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
