import { IconComponent, ModalComponent, ConfirmDialogComponent, PageHeaderComponent, PaginationComponent, FilterBarComponent } from '../../shared/index';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService, Course, Department } from '../../core/mock-data.service';

@Component({
  selector: 'app-course-setup',
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
      title="Course Setup"
      icon="book-open"
      [breadcrumbs]="[{ label: 'Settings' }, { label: 'Course Setup' }]"
    >
      <button type="button" class="btn btn-primary" (click)="openAddModal()">
        <app-icon name="plus" [size]="16"></app-icon>
        <span>Add New Course</span>
      </button>
    </app-page-header>

    <app-filter-bar
      placeholder="Search courses by name or code..."
      (search)="onSearch($event)"
      (export)="exportData()"
    >
      <div filters class="filter-group">
        <select class="form-select" [(ngModel)]="selectedDept" (ngModelChange)="applyFilters()">
          <option value="">All Departments</option>
          <option *ngFor="let d of departments" [value]="d.name">{{ d.name }}</option>
        </select>
      </div>
    </app-filter-bar>

    <div class="card">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Department</th>
              <th>Duration</th>
              <th style="text-align: right;">Course Fee (₹)</th>
              <th>Status</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of pagedCourses; let i = index">
              <td>{{ (currentPage - 1) * pageSize + i + 1 }}</td>
              <td><strong>{{ c.code }}</strong></td>
              <td><strong>{{ c.name }}</strong></td>
              <td>{{ c.department }}</td>
              <td>{{ c.duration }}</td>
              <td style="text-align: right; font-weight: 700; color: var(--color-primary);">₹{{ c.fee | number }}</td>
              <td>
                <span class="badge" [ngClass]="c.status === 'Active' ? 'badge-success' : 'badge-danger'">
                  {{ c.status }}
                </span>
              </td>
              <td style="text-align: right;">
                <div class="table-actions" style="justify-content: flex-end;">
                  <button type="button" class="btn btn-sm btn-secondary" (click)="openEditModal(c)" title="Edit">
                    <app-icon name="edit" [size]="14"></app-icon>
                  </button>
                  <button type="button" class="btn btn-sm btn-danger" (click)="openDeleteConfirm(c)" title="Delete">
                    <app-icon name="trash-2" [size]="14"></app-icon>
                  </button>
                </div>
              </td>
            </tr>
            <tr *ngIf="filteredCourses.length === 0">
              <td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                No courses found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <app-pagination
        [totalItems]="filteredCourses.length"
        [pageSize]="pageSize"
        [currentPage]="currentPage"
        (pageChange)="currentPage = $event"
      ></app-pagination>
    </div>

    <!-- Add/Edit Modal -->
    <app-modal
      [isOpen]="isModalOpen"
      [title]="isEditMode ? 'Edit Course' : 'Create New Course'"
      (closeEvent)="isModalOpen = false"
      (confirmEvent)="saveCourse()"
    >
      <div modal-body>
        <div class="form-grid-2">
          <div class="form-group full-width">
            <label class="form-label required">Course Name</label>
            <input type="text" class="form-control" [(ngModel)]="currentForm.name" placeholder="Full course title" />
          </div>

          <div class="form-group">
            <label class="form-label required">Department</label>
            <select class="form-select" [(ngModel)]="currentForm.department">
              <option *ngFor="let d of departments" [value]="d.name">{{ d.name }}</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label required">Duration</label>
            <input type="text" class="form-control" [(ngModel)]="currentForm.duration" placeholder="e.g. 6 Months" />
          </div>

          <div class="form-group">
            <label class="form-label required">Fee (₹)</label>
            <input type="number" class="form-control" [(ngModel)]="currentForm.fee" />
          </div>

          <div class="form-group">
            <label class="form-label required">Status</label>
            <select class="form-select" [(ngModel)]="currentForm.status">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>
    </app-modal>

    <!-- Delete Confirmation Dialog -->
    <app-confirm-dialog
      [isOpen]="isDeleteModalOpen"
      title="Delete Course"
      [message]="'Are you sure you want to delete course ' + courseToDelete?.name + '?'"
      (confirmEvent)="confirmDelete()"
      (cancelEvent)="isDeleteModalOpen = false"
    ></app-confirm-dialog>
  `
})
export class CourseSetupComponent implements OnInit {
  allCourses: Course[] = [];
  filteredCourses: Course[] = [];
  departments: Department[] = [];

  searchTerm = '';
  selectedDept = '';

  currentPage = 1;
  pageSize = 5;

  isModalOpen = false;
  isEditMode = false;
  isDeleteModalOpen = false;
  courseToDelete: Course | null = null;

  currentForm: {
    id: string;
    name: string;
    department: string;
    duration: string;
    fee: number;
    status: 'Active' | 'Inactive';
  } = {
    id: '',
    name: '',
    department: '',
    duration: '6 Months',
    fee: 40000,
    status: 'Active'
  };

  constructor(private mockDataService: MockDataService) {}

  ngOnInit() {
    this.mockDataService.getCourses().subscribe(c => {
      this.allCourses = c;
      this.applyFilters();
    });
    this.mockDataService.getDepartments().subscribe(d => {
      this.departments = d;
      if (d.length > 0 && !this.currentForm.department) {
        this.currentForm.department = d[0].name;
      }
    });
  }

  onSearch(term: string) {
    this.searchTerm = term.toLowerCase();
    this.applyFilters();
  }

  applyFilters() {
    this.filteredCourses = this.allCourses.filter(c => {
      const matchesSearch =
        !this.searchTerm ||
        c.name.toLowerCase().includes(this.searchTerm) ||
        c.code.toLowerCase().includes(this.searchTerm);

      const matchesDept = !this.selectedDept || c.department === this.selectedDept;

      return matchesSearch && matchesDept;
    });
    this.currentPage = 1;
  }

  get pagedCourses(): Course[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredCourses.slice(start, start + this.pageSize);
  }

  openAddModal() {
    this.isEditMode = false;
    this.currentForm = {
      id: '',
      name: '',
      department: this.departments[0]?.name || '',
      duration: '6 Months',
      fee: 40000,
      status: 'Active'
    };
    this.isModalOpen = true;
  }

  openEditModal(c: Course) {
    this.isEditMode = true;
    this.currentForm = { ...c };
    this.isModalOpen = true;
  }

  saveCourse() {
    if (this.isEditMode) {
      this.mockDataService.updateCourse(this.currentForm.id, this.currentForm);
    } else {
      this.mockDataService.addCourse({
        name: this.currentForm.name,
        department: this.currentForm.department,
        duration: this.currentForm.duration,
        fee: Number(this.currentForm.fee),
        status: this.currentForm.status
      });
    }
    this.isModalOpen = false;
  }

  openDeleteConfirm(c: Course) {
    this.courseToDelete = c;
    this.isDeleteModalOpen = true;
  }

  confirmDelete() {
    if (this.courseToDelete) {
      this.mockDataService.deleteCourse(this.courseToDelete.id);
      this.isDeleteModalOpen = false;
      this.courseToDelete = null;
    }
  }

  exportData() {
    const csvContent = 'data:text/csv;charset=utf-8,' +
      'Code,Name,Department,Duration,Fee,Status\n' +
      this.filteredCourses.map(c => `${c.code},"${c.name}","${c.department}","${c.duration}",${c.fee},${c.status}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Courses_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
