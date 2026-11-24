import { IconComponent, ModalComponent, ConfirmDialogComponent, PageHeaderComponent, PaginationComponent, FilterBarComponent } from '../../shared/index';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService, Account, Branch } from '../../core/mock-data.service';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageHeaderComponent,
    FilterBarComponent,
    PaginationComponent,
    ModalComponent,
    ConfirmDialogComponent,
    IconComponent
  ],
  template: `
    <app-page-header
      title="Account Management"
      icon="wallet"
      [breadcrumbs]="[{ label: 'Accounts' }, { label: 'Account Management' }]"
    >
      <button type="button" class="btn btn-primary" (click)="openCreateModal()">
        <app-icon name="plus" [size]="16"></app-icon>
        <span>Create New Account</span>
      </button>
    </app-page-header>

    <!-- Filters -->
    <app-filter-bar
      placeholder="Search by account title or code..."
      (search)="onSearch($event)"
      (export)="exportData()"
    >
      <div filters class="filter-group">
        <select class="form-select" [(ngModel)]="selectedType" (ngModelChange)="applyFilters()">
          <option value="">All Account Types</option>
          <option value="Bank">Bank Account</option>
          <option value="Cash">Cash Account</option>
          <option value="Asset">Asset</option>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>

        <select class="form-select" [(ngModel)]="selectedBranch" (ngModelChange)="applyFilters()">
          <option value="">All Branches</option>
          <option *ngFor="let b of branches" [value]="b.name">{{ b.name }}</option>
        </select>
      </div>
    </app-filter-bar>

    <!-- Accounts Table -->
    <div class="card">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Account Code</th>
              <th>Account Name</th>
              <th>Type</th>
              <th>Branch</th>
              <th>Opening Balance</th>
              <th>Current Balance</th>
              <th>Status</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let acc of pagedAccounts; let i = index">
              <td>{{ (currentPage - 1) * pageSize + i + 1 }}</td>
              <td><strong>{{ acc.code }}</strong></td>
              <td><strong>{{ acc.name }}</strong></td>
              <td>
                <span class="badge badge-secondary">{{ acc.type }}</span>
              </td>
              <td>{{ acc.branch.split(' - ')[0] }}</td>
              <td>₹{{ acc.openingBalance | number }}</td>
              <td style="color: var(--color-primary); font-weight: 600;">₹{{ acc.currentBalance | number }}</td>
              <td>
                <span class="badge" [ngClass]="acc.status === 'Active' ? 'badge-success' : 'badge-danger'">
                  {{ acc.status }}
                </span>
              </td>
              <td style="text-align: right;">
                <div class="table-actions" style="justify-content: flex-end;">
                  <button type="button" class="btn btn-sm btn-secondary" (click)="openEditModal(acc)" title="Edit">
                    <app-icon name="edit" [size]="14"></app-icon>
                  </button>
                  <button type="button" class="btn btn-sm btn-danger" (click)="openDeleteConfirm(acc)" title="Delete">
                    <app-icon name="trash-2" [size]="14"></app-icon>
                  </button>
                </div>
              </td>
            </tr>
            <tr *ngIf="filteredAccounts.length === 0">
              <td colspan="9" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                No accounts found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <app-pagination
        [totalItems]="filteredAccounts.length"
        [pageSize]="pageSize"
        [currentPage]="currentPage"
        (pageChange)="currentPage = $event"
      ></app-pagination>
    </div>

    <!-- Create / Edit Account Modal -->
    <app-modal
      [isOpen]="isModalOpen"
      [title]="isEditMode ? 'Edit Account' : 'Create New Account'"
      (closeEvent)="isModalOpen = false"
      (confirmEvent)="saveAccount()"
    >
      <div modal-body>
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label required">Account Name</label>
            <input type="text" class="form-control" [(ngModel)]="currentForm.name" placeholder="e.g. Canara Bank Operating A/C" />
          </div>

          <div class="form-group">
            <label class="form-label required">Account Type</label>
            <select class="form-select" [(ngModel)]="currentForm.type">
              <option value="Bank">Bank Account</option>
              <option value="Cash">Cash Account</option>
              <option value="Asset">Asset</option>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label required">Associated Branch</label>
            <select class="form-select" [(ngModel)]="currentForm.branch">
              <option *ngFor="let b of branches" [value]="b.name">{{ b.name }}</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label required">Opening Balance (₹)</label>
            <input type="number" class="form-control" [(ngModel)]="currentForm.openingBalance" />
          </div>

          <div class="form-group">
            <label class="form-label required">Current Balance (₹)</label>
            <input type="number" class="form-control" [(ngModel)]="currentForm.currentBalance" />
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

    <!-- Confirm Delete Dialog -->
    <app-confirm-dialog
      [isOpen]="isDeleteModalOpen"
      title="Delete Account"
      [message]="'Are you sure you want to delete account ' + accountToDelete?.name + '?'"
      (confirmEvent)="confirmDelete()"
      (cancelEvent)="isDeleteModalOpen = false"
    ></app-confirm-dialog>
  `
})
export class AccountsComponent implements OnInit {
  allAccounts: Account[] = [];
  filteredAccounts: Account[] = [];
  branches: Branch[] = [];

  searchTerm = '';
  selectedType = '';
  selectedBranch = '';

  currentPage = 1;
  pageSize = 5;

  isModalOpen = false;
  isEditMode = false;
  isDeleteModalOpen = false;
  accountToDelete: Account | null = null;

  currentForm: {
    id: string;
    name: string;
    type: 'Bank' | 'Cash' | 'Asset' | 'Income' | 'Expense';
    branch: string;
    openingBalance: number;
    currentBalance: number;
    status: 'Active' | 'Inactive';
  } = {
    id: '',
    name: '',
    type: 'Bank',
    branch: '',
    openingBalance: 0,
    currentBalance: 0,
    status: 'Active'
  };

  constructor(private mockDataService: MockDataService) {}

  ngOnInit() {
    this.mockDataService.getAccounts().subscribe(acc => {
      this.allAccounts = acc;
      this.applyFilters();
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
    this.filteredAccounts = this.allAccounts.filter(acc => {
      const matchesSearch =
        !this.searchTerm ||
        acc.name.toLowerCase().includes(this.searchTerm) ||
        acc.code.toLowerCase().includes(this.searchTerm);

      const matchesType = !this.selectedType || acc.type === this.selectedType;
      const matchesBranch = !this.selectedBranch || acc.branch === this.selectedBranch;

      return matchesSearch && matchesType && matchesBranch;
    });
    this.currentPage = 1;
  }

  get pagedAccounts(): Account[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredAccounts.slice(start, start + this.pageSize);
  }

  openCreateModal() {
    this.isEditMode = false;
    this.currentForm = {
      id: '',
      name: '',
      type: 'Bank',
      branch: this.branches[0]?.name || '',
      openingBalance: 0,
      currentBalance: 0,
      status: 'Active'
    };
    this.isModalOpen = true;
  }

  openEditModal(acc: Account) {
    this.isEditMode = true;
    this.currentForm = { ...acc };
    this.isModalOpen = true;
  }

  saveAccount() {
    if (this.isEditMode) {
      this.mockDataService.updateAccount(this.currentForm.id, this.currentForm);
    } else {
      this.mockDataService.addAccount({
        name: this.currentForm.name,
        type: this.currentForm.type,
        branch: this.currentForm.branch,
        openingBalance: Number(this.currentForm.openingBalance),
        currentBalance: Number(this.currentForm.currentBalance),
        status: this.currentForm.status
      });
    }
    this.isModalOpen = false;
  }

  openDeleteConfirm(acc: Account) {
    this.accountToDelete = acc;
    this.isDeleteModalOpen = true;
  }

  confirmDelete() {
    if (this.accountToDelete) {
      this.mockDataService.deleteAccount(this.accountToDelete.id);
      this.isDeleteModalOpen = false;
      this.accountToDelete = null;
    }
  }

  exportData() {
    const csvContent = 'data:text/csv;charset=utf-8,' +
      'Code,Name,Type,Branch,OpeningBalance,CurrentBalance,Status\n' +
      this.filteredAccounts.map(a => `${a.code},"${a.name}",${a.type},"${a.branch}",${a.openingBalance},${a.currentBalance},${a.status}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Accounts_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
