import { IconComponent, ModalComponent, ConfirmDialogComponent, PageHeaderComponent, PaginationComponent, FilterBarComponent } from '../../shared/index';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService, Department } from '../../core/mock-data.service';

@Component({
  selector: 'app-departments',
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
      title="Department Management"
      icon="building"
      [breadcrumbs]="[{ label: 'Settings' }, { label: 'Departments' }]"
    >
      <button type="button" class="btn btn-primary" (click)="openAddModal()">
        <app-icon name="plus" [size]="16"></app-icon>
        <span>Create New Department</span>
      </button>
    </app-page-header>

    <app-filter-bar
      placeholder="Search departments by name, code or HOD..."
      (search)="onSearch($event)"
      (export)="exportData()"
    ></app-filter-bar>

    <div class="card">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Dept Code</th>
              <th>Department Name</th>
              <th>Head of Department (HOD)</th>
              <th>Status</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let d of pagedDepartments; let i = index">
              <td>{{ (currentPage - 1) * pageSize + i + 1 }}</td>
              <td><strong>{{ d.code }}</strong></td>
              <td><strong>{{ d.name }}</strong></td>
              <td>{{ d.headOfDepartment }}</td>
              <td>
                <span class="badge" [ngClass]="d.status === 'Active' ? 'badge-success' : 'badge-danger'">
                  {{ d.status }}
                </span>
              </td>
              <td style="text-align: right;">
                <div class="table-actions" style="justify-content: flex-end;">
                  <button type="button" class="btn btn-sm btn-secondary" (click)="openEditModal(d)" title="Edit">
                    <app-icon name="edit" [size]="14"></app-icon>
                  </button>
                  <button type="button" class="btn btn-sm btn-danger" (click)="openDeleteConfirm(d)" title="Delete">
                    <app-icon name="trash-2" [size]="14"></app-icon>
                  </button>
                </div>
              </td>
            </tr>
            <tr *ngIf="filteredDepartments.length === 0">
              <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                No departments found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <app-pagination
        [totalItems]="filteredDepartments.length"
        [pageSize]="pageSize"
        [currentPage]="currentPage"
        (pageChange)="currentPage = $event"
      ></app-pagination>
    </div>

    <!-- Create / Edit Modal -->
    <app-modal
      [isOpen]="isModalOpen"
      [title]="isEditMode ? 'Edit Department' : 'Create New Department'"
      (closeEvent)="isModalOpen = false"
      (confirmEvent)="saveDept()"
    >
      <div modal-body>
        <div class="form-grid-2">
          <div class="form-group full-width">
            <label class="form-label required">Department Name</label>
            <input type="text" class="form-control" [(ngModel)]="currentForm.name" placeholder="Department title" />
          </div>

          <div class="form-group">
            <label class="form-label required">Head of Department (HOD)</label>
            <input type="text" class="form-control" [(ngModel)]="currentForm.headOfDepartment" placeholder="HOD Name" />
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
      title="Delete Department"
      [message]="'Are you sure you want to delete ' + deptToDelete?.name + '?'"
      (confirmEvent)="confirmDelete()"
      (cancelEvent)="isDeleteModalOpen = false"
    ></app-confirm-dialog>
  `
})
export class DepartmentsComponent implements OnInit {
  allDepartments: Department[] = [];
  filteredDepartments: Department[] = [];

  searchTerm = '';
  currentPage = 1;
  pageSize = 5;

  isModalOpen = false;
  isEditMode = false;
  editingDeptId = '';
  isDeleteModalOpen = false;
  deptToDelete: Department | null = null;

  currentForm: {
    name: string;
    headOfDepartment: string;
    status: 'Active' | 'Inactive';
  } = {
    name: '',
    headOfDepartment: '',
    status: 'Active'
  };

  constructor(private mockDataService: MockDataService) {}

  ngOnInit() {
    this.mockDataService.getDepartments().subscribe(d => {
      this.allDepartments = d;
      this.applyFilters();
    });
  }

  onSearch(term: string) {
    this.searchTerm = term.toLowerCase();
    this.applyFilters();
  }

  applyFilters() {
    this.filteredDepartments = this.allDepartments.filter(d =>
      !this.searchTerm ||
      d.name.toLowerCase().includes(this.searchTerm) ||
      d.code.toLowerCase().includes(this.searchTerm) ||
      d.headOfDepartment.toLowerCase().includes(this.searchTerm)
    );
    this.currentPage = 1;
  }

  get pagedDepartments(): Department[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredDepartments.slice(start, start + this.pageSize);
  }

  openAddModal() {
    this.isEditMode = false;
    this.currentForm = {
      name: '',
      headOfDepartment: '',
      status: 'Active'
    };
    this.isModalOpen = true;
  }

  openEditModal(d: Department) {
    this.isEditMode = true;
    this.editingDeptId = d.id;
    this.currentForm = {
      name: d.name,
      headOfDepartment: d.headOfDepartment,
      status: d.status
    };
    this.isModalOpen = true;
  }

  saveDept() {
    if (this.isEditMode) {
      this.mockDataService.updateDepartment(this.editingDeptId, this.currentForm);
    } else {
      this.mockDataService.addDepartment(this.currentForm);
    }
    this.isModalOpen = false;
  }

  openDeleteConfirm(d: Department) {
    this.deptToDelete = d;
    this.isDeleteModalOpen = true;
  }

  confirmDelete() {
    if (this.deptToDelete) {
      this.mockDataService.deleteDepartment(this.deptToDelete.id);
      this.isDeleteModalOpen = false;
      this.deptToDelete = null;
    }
  }

  exportData() {
    const csvContent = 'data:text/csv;charset=utf-8,' +
      'Code,Name,HeadOfDepartment,Status\n' +
      this.filteredDepartments.map(d => `${d.code},"${d.name}","${d.headOfDepartment}",${d.status}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Departments_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
