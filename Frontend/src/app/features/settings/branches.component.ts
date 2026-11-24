import { IconComponent, ModalComponent, ConfirmDialogComponent, PageHeaderComponent, PaginationComponent, FilterBarComponent } from '../../shared/index';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService, Branch } from '../../core/mock-data.service';

@Component({
  selector: 'app-branches',
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
      title="Branch Management"
      icon="git-branch"
      [breadcrumbs]="[{ label: 'Settings' }, { label: 'Branches' }]"
    >
      <button type="button" class="btn btn-primary" (click)="openAddModal()">
        <app-icon name="plus" [size]="16"></app-icon>
        <span>Create New Branch</span>
      </button>
    </app-page-header>

    <app-filter-bar
      placeholder="Search branch by name, code or city..."
      (search)="onSearch($event)"
      (export)="exportData()"
    ></app-filter-bar>

    <div class="card">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Branch Code</th>
              <th>Branch Name</th>
              <th>City</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Status</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let b of pagedBranches; let i = index">
              <td>{{ (currentPage - 1) * pageSize + i + 1 }}</td>
              <td><strong>{{ b.code }}</strong></td>
              <td><strong>{{ b.name }}</strong></td>
              <td>{{ b.city }}</td>
              <td>{{ b.phone }}</td>
              <td style="max-width: 250px;">{{ b.address }}</td>
              <td>
                <span class="badge" [ngClass]="b.status === 'Active' ? 'badge-success' : 'badge-danger'">
                  {{ b.status }}
                </span>
              </td>
              <td style="text-align: right;">
                <div class="table-actions" style="justify-content: flex-end;">
                  <button type="button" class="btn btn-sm btn-secondary" (click)="openEditModal(b)" title="Edit">
                    <app-icon name="edit" [size]="14"></app-icon>
                  </button>
                  <button type="button" class="btn btn-sm btn-danger" (click)="openDeleteConfirm(b)" title="Delete">
                    <app-icon name="trash-2" [size]="14"></app-icon>
                  </button>
                </div>
              </td>
            </tr>
            <tr *ngIf="filteredBranches.length === 0">
              <td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                No branches found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <app-pagination
        [totalItems]="filteredBranches.length"
        [pageSize]="pageSize"
        [currentPage]="currentPage"
        (pageChange)="currentPage = $event"
      ></app-pagination>
    </div>

    <!-- Create / Edit Modal -->
    <app-modal
      [isOpen]="isModalOpen"
      [title]="isEditMode ? 'Edit Branch' : 'Create New Branch'"
      (closeEvent)="isModalOpen = false"
      (confirmEvent)="saveBranch()"
    >
      <div modal-body>
        <div class="form-grid-2">
          <div class="form-group full-width">
            <label class="form-label required">Branch Name</label>
            <input type="text" class="form-control" [(ngModel)]="currentForm.name" placeholder="Branch Title" />
          </div>

          <div class="form-group">
            <label class="form-label required">City</label>
            <input type="text" class="form-control" [(ngModel)]="currentForm.city" placeholder="City" />
          </div>

          <div class="form-group">
            <label class="form-label required">Office Phone</label>
            <input type="text" class="form-control" [(ngModel)]="currentForm.phone" placeholder="+91 ..." />
          </div>

          <div class="form-group full-width">
            <label class="form-label required">Address</label>
            <textarea class="form-textarea" [(ngModel)]="currentForm.address" rows="2" placeholder="Full address"></textarea>
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
      title="Delete Branch"
      [message]="'Are you sure you want to delete branch ' + branchToDelete?.name + '?'"
      (confirmEvent)="confirmDelete()"
      (cancelEvent)="isDeleteModalOpen = false"
    ></app-confirm-dialog>
  `
})
export class BranchesComponent implements OnInit {
  allBranches: Branch[] = [];
  filteredBranches: Branch[] = [];

  searchTerm = '';
  currentPage = 1;
  pageSize = 5;

  isModalOpen = false;
  isEditMode = false;
  editingBranchId = '';
  isDeleteModalOpen = false;
  branchToDelete: Branch | null = null;

  currentForm: {
    name: string;
    city: string;
    phone: string;
    address: string;
    status: 'Active' | 'Inactive';
  } = {
    name: '',
    city: '',
    phone: '',
    address: '',
    status: 'Active'
  };

  constructor(private mockDataService: MockDataService) {}

  ngOnInit() {
    this.mockDataService.getBranches().subscribe(b => {
      this.allBranches = b;
      this.applyFilters();
    });
  }

  onSearch(term: string) {
    this.searchTerm = term.toLowerCase();
    this.applyFilters();
  }

  applyFilters() {
    this.filteredBranches = this.allBranches.filter(b =>
      !this.searchTerm ||
      b.name.toLowerCase().includes(this.searchTerm) ||
      b.code.toLowerCase().includes(this.searchTerm) ||
      b.city.toLowerCase().includes(this.searchTerm)
    );
    this.currentPage = 1;
  }

  get pagedBranches(): Branch[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredBranches.slice(start, start + this.pageSize);
  }

  openAddModal() {
    this.isEditMode = false;
    this.currentForm = {
      name: '',
      city: '',
      phone: '',
      address: '',
      status: 'Active'
    };
    this.isModalOpen = true;
  }

  openEditModal(b: Branch) {
    this.isEditMode = true;
    this.editingBranchId = b.id;
    this.currentForm = {
      name: b.name,
      city: b.city,
      phone: b.phone,
      address: b.address,
      status: b.status
    };
    this.isModalOpen = true;
  }

  saveBranch() {
    if (this.isEditMode) {
      this.mockDataService.updateBranch(this.editingBranchId, this.currentForm);
    } else {
      this.mockDataService.addBranch(this.currentForm);
    }
    this.isModalOpen = false;
  }

  openDeleteConfirm(b: Branch) {
    this.branchToDelete = b;
    this.isDeleteModalOpen = true;
  }

  confirmDelete() {
    if (this.branchToDelete) {
      this.mockDataService.deleteBranch(this.branchToDelete.id);
      this.isDeleteModalOpen = false;
      this.branchToDelete = null;
    }
  }

  exportData() {
    const csvContent = 'data:text/csv;charset=utf-8,' +
      'Code,Name,City,Phone,Address,Status\n' +
      this.filteredBranches.map(b => `${b.code},"${b.name}","${b.city}",${b.phone},"${b.address}",${b.status}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Branches_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
