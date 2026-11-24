import { IconComponent, ModalComponent, ConfirmDialogComponent, PageHeaderComponent, PaginationComponent, FilterBarComponent } from '../../shared/index';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService, UserRole } from '../../core/mock-data.service';

@Component({
  selector: 'app-user-roles',
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
      title="User Roles"
      icon="shield"
      [breadcrumbs]="[{ label: 'Settings' }, { label: 'User Roles' }]"
    >
      <button type="button" class="btn btn-primary" (click)="openAddModal()">
        <app-icon name="plus" [size]="16"></app-icon>
        <span>Create New Role</span>
      </button>
    </app-page-header>

    <app-filter-bar
      placeholder="Search user roles by name or description..."
      (search)="onSearch($event)"
      (export)="exportData()"
    ></app-filter-bar>

    <div class="card">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Role Name</th>
              <th>Description</th>
              <th>Permissions Count</th>
              <th>Status</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let r of pagedRoles; let i = index">
              <td>{{ (currentPage - 1) * pageSize + i + 1 }}</td>
              <td><strong>{{ r.name }}</strong></td>
              <td>{{ r.description }}</td>
              <td><span class="badge badge-primary">{{ r.permissionsCount }} Permissions</span></td>
              <td>
                <span class="badge" [ngClass]="r.status === 'Active' ? 'badge-success' : 'badge-danger'">
                  {{ r.status }}
                </span>
              </td>
              <td style="text-align: right;">
                <div class="table-actions" style="justify-content: flex-end;">
                  <button type="button" class="btn btn-sm btn-secondary" (click)="openEditModal(r)" title="Edit">
                    <app-icon name="edit" [size]="14"></app-icon>
                  </button>
                  <button type="button" class="btn btn-sm btn-danger" (click)="openDeleteConfirm(r)" title="Delete">
                    <app-icon name="trash-2" [size]="14"></app-icon>
                  </button>
                </div>
              </td>
            </tr>
            <tr *ngIf="filteredRoles.length === 0">
              <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                No roles found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <app-pagination
        [totalItems]="filteredRoles.length"
        [pageSize]="pageSize"
        [currentPage]="currentPage"
        (pageChange)="currentPage = $event"
      ></app-pagination>
    </div>

    <!-- Modal -->
    <app-modal
      [isOpen]="isModalOpen"
      [title]="isEditMode ? 'Edit User Role' : 'Create New User Role'"
      (closeEvent)="isModalOpen = false"
      (confirmEvent)="saveRole()"
    >
      <div modal-body>
        <div class="form-grid-2">
          <div class="form-group full-width">
            <label class="form-label required">Role Name</label>
            <input type="text" class="form-control" [(ngModel)]="currentForm.name" placeholder="e.g. Finance Auditor" />
          </div>

          <div class="form-group full-width">
            <label class="form-label required">Role Description</label>
            <input type="text" class="form-control" [(ngModel)]="currentForm.description" placeholder="Short description of responsibility" />
          </div>

          <div class="form-group">
            <label class="form-label required">Permissions Count</label>
            <input type="number" class="form-control" [(ngModel)]="currentForm.permissionsCount" />
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
      title="Delete User Role"
      [message]="'Are you sure you want to delete role ' + roleToDelete?.name + '?'"
      (confirmEvent)="confirmDelete()"
      (cancelEvent)="isDeleteModalOpen = false"
    ></app-confirm-dialog>
  `
})
export class UserRolesComponent implements OnInit {
  allRoles: UserRole[] = [];
  filteredRoles: UserRole[] = [];

  searchTerm = '';
  currentPage = 1;
  pageSize = 5;

  isModalOpen = false;
  isEditMode = false;
  isDeleteModalOpen = false;
  roleToDelete: UserRole | null = null;

  currentForm: {
    id: string;
    name: string;
    description: string;
    permissionsCount: number;
    status: 'Active' | 'Inactive';
  } = {
    id: '',
    name: '',
    description: '',
    permissionsCount: 20,
    status: 'Active'
  };

  constructor(private mockDataService: MockDataService) {}

  ngOnInit() {
    this.mockDataService.getUserRoles().subscribe(roles => {
      this.allRoles = roles;
      this.applyFilters();
    });
  }

  onSearch(term: string) {
    this.searchTerm = term.toLowerCase();
    this.applyFilters();
  }

  applyFilters() {
    this.filteredRoles = this.allRoles.filter(r =>
      !this.searchTerm ||
      r.name.toLowerCase().includes(this.searchTerm) ||
      r.description.toLowerCase().includes(this.searchTerm)
    );
    this.currentPage = 1;
  }

  get pagedRoles(): UserRole[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredRoles.slice(start, start + this.pageSize);
  }

  openAddModal() {
    this.isEditMode = false;
    this.currentForm = {
      id: '',
      name: '',
      description: '',
      permissionsCount: 20,
      status: 'Active'
    };
    this.isModalOpen = true;
  }

  openEditModal(r: UserRole) {
    this.isEditMode = true;
    this.currentForm = { ...r };
    this.isModalOpen = true;
  }

  saveRole() {
    if (this.isEditMode) {
      this.mockDataService.updateUserRole(this.currentForm.id, this.currentForm);
    } else {
      this.mockDataService.addUserRole({
        name: this.currentForm.name,
        description: this.currentForm.description,
        permissionsCount: Number(this.currentForm.permissionsCount),
        status: this.currentForm.status
      });
    }
    this.isModalOpen = false;
  }

  openDeleteConfirm(r: UserRole) {
    this.roleToDelete = r;
    this.isDeleteModalOpen = true;
  }

  confirmDelete() {
    if (this.roleToDelete) {
      this.mockDataService.deleteUserRole(this.roleToDelete.id);
      this.isDeleteModalOpen = false;
      this.roleToDelete = null;
    }
  }

  exportData() {
    const csvContent = 'data:text/csv;charset=utf-8,' +
      'Name,Description,PermissionsCount,Status\n' +
      this.filteredRoles.map(r => `"${r.name}","${r.description}",${r.permissionsCount},${r.status}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `User_Roles_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
