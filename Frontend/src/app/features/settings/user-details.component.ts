import { IconComponent, ModalComponent, ConfirmDialogComponent, PageHeaderComponent, PaginationComponent, FilterBarComponent } from '../../shared/index';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MockDataService, SystemUser, UserRole, Branch } from '../../core/mock-data.service';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [
    PageHeaderComponent,
    FilterBarComponent,
    PaginationComponent,
    CommonModule,
    FormsModule,
    RouterModule,
    ModalComponent,
    ConfirmDialogComponent,
    IconComponent
  ],
  template: `
    <app-page-header
      title="User Details"
      icon="users"
      [breadcrumbs]="[{ label: 'Settings' }, { label: 'User Details' }]"
    >
      <button type="button" class="btn btn-primary" (click)="openCreateModal()">
        <app-icon name="user-plus" [size]="16"></app-icon>
        <span>Create New User</span>
      </button>
    </app-page-header>

    <app-filter-bar
      placeholder="Search users by name, username or email..."
      (search)="onSearch($event)"
      (export)="exportData()"
    >
      <div filters class="filter-group">
        <select class="form-select" [(ngModel)]="selectedRole" (ngModelChange)="applyFilters()">
          <option value="">All Roles</option>
          <option *ngFor="let r of roles" [value]="r.name">{{ r.name }}</option>
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
              <th>#</th>
              <th>Username</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Branch</th>
              <th>Status</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let u of pagedUsers; let i = index">
              <td>{{ (currentPage - 1) * pageSize + i + 1 }}</td>
              <td><strong>{{ u.username }}</strong></td>
              <td><strong>{{ u.fullName }}</strong></td>
              <td>{{ u.email }}</td>
              <td>{{ u.phone }}</td>
              <td><span class="badge badge-primary">{{ u.role }}</span></td>
              <td>{{ u.branch.split(' - ')[0] }}</td>
              <td>
                <span class="badge" [ngClass]="u.status === 'Active' ? 'badge-success' : 'badge-danger'">
                  {{ u.status }}
                </span>
              </td>
              <td style="text-align: right;">
                <div class="table-actions" style="justify-content: flex-end;">
                  <button type="button" class="btn btn-sm btn-secondary" (click)="openEditModal(u)" title="Edit">
                    <app-icon name="edit" [size]="14"></app-icon>
                  </button>
                  <button type="button" class="btn btn-sm btn-danger" (click)="openDeleteConfirm(u)" title="Delete">
                    <app-icon name="trash-2" [size]="14"></app-icon>
                  </button>
                </div>
              </td>
            </tr>
            <tr *ngIf="filteredUsers.length === 0">
              <td colspan="9" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                No users found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <app-pagination
        [totalItems]="filteredUsers.length"
        [pageSize]="pageSize"
        [currentPage]="currentPage"
        (pageChange)="currentPage = $event"
      ></app-pagination>
    </div>

    <!-- Create / Edit User Modal -->
    <app-modal
      [isOpen]="isModalOpen"
      [title]="isEditMode ? 'Edit User Profile' : 'Create New User'"
      (closeEvent)="isModalOpen = false"
      (confirmEvent)="saveUser()"
    >
      <div modal-body>
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label required">Username</label>
            <input type="text" class="form-control" [(ngModel)]="currentForm.username" [disabled]="isEditMode" />
          </div>

          <div class="form-group">
            <label class="form-label required">Full Name</label>
            <input type="text" class="form-control" [(ngModel)]="currentForm.fullName" />
          </div>

          <div class="form-group">
            <label class="form-label required">Email</label>
            <input type="email" class="form-control" [(ngModel)]="currentForm.email" />
          </div>

          <div class="form-group">
            <label class="form-label required">Phone</label>
            <input type="tel" class="form-control" [(ngModel)]="currentForm.phone" />
          </div>

          <div class="form-group">
            <label class="form-label required">Role</label>
            <select class="form-select" [(ngModel)]="currentForm.role">
              <option *ngFor="let r of roles" [value]="r.name">{{ r.name }}</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label required">Branch</label>
            <select class="form-select" [(ngModel)]="currentForm.branch">
              <option *ngFor="let b of branches" [value]="b.name">{{ b.name }}</option>
            </select>
          </div>

          <div class="form-group" *ngIf="!isEditMode">
            <label class="form-label required">Password</label>
            <input type="password" class="form-control" [(ngModel)]="currentForm.password" placeholder="••••••••" />
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
      title="Delete User"
      [message]="'Are you sure you want to delete user ' + userToDelete?.fullName + ' (' + userToDelete?.username + ')?'"
      (confirmEvent)="confirmDelete()"
      (cancelEvent)="isDeleteModalOpen = false"
    ></app-confirm-dialog>
  `
})
export class UserDetailsComponent implements OnInit {
  allUsers: SystemUser[] = [];
  filteredUsers: SystemUser[] = [];
  roles: UserRole[] = [];
  branches: Branch[] = [];

  searchTerm = '';
  selectedRole = '';
  selectedBranch = '';

  currentPage = 1;
  pageSize = 5;

  isModalOpen = false;
  isEditMode = false;
  editingUserId: string = '';
  isDeleteModalOpen = false;
  userToDelete: SystemUser | null = null;

  currentForm: {
    username: string;
    fullName: string;
    email: string;
    phone: string;
    role: string;
    branch: string;
    password: string;
    status: 'Active' | 'Inactive';
  } = {
    username: '',
    fullName: '',
    email: '',
    phone: '',
    role: '',
    branch: '',
    password: '',
    status: 'Active'
  };

  constructor(private mockDataService: MockDataService) {}

  ngOnInit() {
    this.mockDataService.getSystemUsers().subscribe(users => {
      this.allUsers = users;
      this.applyFilters();
    });
    this.mockDataService.getUserRoles().subscribe(r => {
      this.roles = r;
      if (r.length > 0 && !this.currentForm.role) {
        this.currentForm.role = r[0].name;
      }
    });
    this.mockDataService.getBranches().subscribe(b => {
      this.branches = b;
      if (b.length > 0 && !this.currentForm.branch) {
        this.currentForm.branch = b[0].name;
      }
    });
  }

  onSearch(term: string) {
    this.searchTerm = term.toLowerCase();
    this.applyFilters();
  }

  applyFilters() {
    this.filteredUsers = this.allUsers.filter(u => {
      const matchesSearch =
        !this.searchTerm ||
        u.fullName.toLowerCase().includes(this.searchTerm) ||
        u.username.toLowerCase().includes(this.searchTerm) ||
        u.email.toLowerCase().includes(this.searchTerm);

      const matchesRole = !this.selectedRole || u.role === this.selectedRole;
      const matchesBranch = !this.selectedBranch || u.branch === this.selectedBranch;

      return matchesSearch && matchesRole && matchesBranch;
    });
    this.currentPage = 1;
  }

  get pagedUsers(): SystemUser[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers.slice(start, start + this.pageSize);
  }

  openCreateModal() {
    this.isEditMode = false;
    this.currentForm = {
      username: '',
      fullName: '',
      email: '',
      phone: '',
      role: this.roles[0]?.name || '',
      branch: this.branches[0]?.name || '',
      password: '',
      status: 'Active'
    };
    this.isModalOpen = true;
  }

  openEditModal(u: SystemUser) {
    this.isEditMode = true;
    this.editingUserId = u.id;
    this.currentForm = {
      username: u.username,
      fullName: u.fullName,
      email: u.email,
      phone: u.phone,
      role: u.role,
      branch: u.branch,
      password: '',
      status: u.status
    };
    this.isModalOpen = true;
  }

  saveUser() {
    if (this.isEditMode) {
      this.mockDataService.updateUser(this.editingUserId, this.currentForm);
    } else {
      this.mockDataService.addUser(this.currentForm);
    }
    this.isModalOpen = false;
  }

  openDeleteConfirm(u: SystemUser) {
    this.userToDelete = u;
    this.isDeleteModalOpen = true;
  }

  confirmDelete() {
    if (this.userToDelete) {
      this.mockDataService.deleteUser(this.userToDelete.id);
      this.isDeleteModalOpen = false;
      this.userToDelete = null;
    }
  }

  exportData() {
    const csvContent = 'data:text/csv;charset=utf-8,' +
      'Username,FullName,Email,Phone,Role,Branch,Status\n' +
      this.filteredUsers.map(u => `${u.username},"${u.fullName}",${u.email},${u.phone},"${u.role}","${u.branch}",${u.status}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Users_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
