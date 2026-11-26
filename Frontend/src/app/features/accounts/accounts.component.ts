import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../shared/components/icon.component';
import { ConfirmDialogComponent } from '../../shared/components/modal.component';
import { DataService, Account, BranchAccountConfig } from '../../core/data.service';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, ConfirmDialogComponent],
  template: `
    <div class="accounts-page-container">
      <!-- Top Title & Create Action Header -->
      <div class="accounts-header">
        <h1 class="page-title">Accounts</h1>
        <button type="button" class="btn-create" (click)="openCreateModal()">CREATE</button>
      </div>

      <!-- Accounts Table Card -->
      <div class="table-card">
        <table class="accounts-table">
          <thead>
            <tr>
              <th style="width: 80px;">Sl No</th>
              <th style="width: 320px;">Account</th>
              <th>Details</th>
              <th style="width: 80px; text-align: center;">Edit</th>
              <th style="width: 80px; text-align: center;">Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let acc of accounts; let i = index">
              <td>{{ i + 1 }}</td>
              <td class="font-bold text-dark">{{ acc.name }}</td>
              <td class="text-secondary">{{ acc.details || acc.description }}</td>
              <td style="text-align: center;">
                <button
                  type="button"
                  class="btn-action-edit"
                  [ngClass]="getEditBadgeClass(i)"
                  (click)="openEditModal(acc)"
                  title="Edit Account"
                >
                  <app-icon name="edit" [size]="14"></app-icon>
                </button>
              </td>
              <td style="text-align: center;">
                <button
                  type="button"
                  class="btn-action-delete"
                  [ngClass]="getDeleteBadgeClass(i)"
                  (click)="deleteAccount(acc)"
                  title="Delete Account"
                >
                  <app-icon name="trash-2" [size]="14"></app-icon>
                </button>
              </td>
            </tr>
            <tr *ngIf="accounts.length === 0">
              <td colspan="5" class="empty-state">No accounts available.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Accounts Create / Edit Modal (Matching Screenshot Exactly) -->
      <div class="modal-backdrop" *ngIf="isModalOpen" (click)="closeModal()">
        <div class="modal-dialog" (click)="$event.stopPropagation()">
          <!-- Modal Blue Header -->
          <div class="modal-header">
            <h3 class="modal-title">Accounts</h3>
            <button type="button" class="modal-close-btn" (click)="closeModal()">✕</button>
          </div>

          <!-- Modal Body Form -->
          <div class="modal-body">
            <div class="form-row">
              <label class="form-label">Account</label>
              <input
                type="text"
                class="form-input"
                [(ngModel)]="currentAccount.name"
                placeholder="Enter account name"
              />
            </div>

            <div class="form-row">
              <label class="form-label">Details</label>
              <input
                type="text"
                class="form-input"
                [(ngModel)]="currentAccount.details"
                placeholder="Enter account details"
              />
            </div>

            <div class="form-row">
              <label class="form-label">Description</label>
              <input
                type="text"
                class="form-input"
                [(ngModel)]="currentAccount.description"
                placeholder="Enter description"
              />
            </div>

            <!-- Select Branches Section -->
            <div class="branches-section">
              <div class="section-title">Select Branches</div>

              <div class="branches-table-box">
                <table class="branches-table">
                  <thead>
                    <tr>
                      <th style="width: 70px;">Select</th>
                      <th>Branch</th>
                      <th style="width: 140px;">Opening</th>
                      <th style="width: 140px;">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let b of branchRows">
                      <td>
                        <input
                          type="checkbox"
                          class="form-checkbox"
                          [(ngModel)]="b.selected"
                        />
                      </td>
                      <td class="branch-name">{{ b.branch }}</td>
                      <td>
                        <input
                          type="number"
                          class="branch-input"
                          [(ngModel)]="b.opening"
                        />
                      </td>
                      <td>
                        <select class="branch-select" [(ngModel)]="b.type">
                          <option value="Select">Select</option>
                          <option value="Bank">Bank</option>
                          <option value="Cash">Cash</option>
                          <option value="Asset">Asset</option>
                          <option value="Income">Income</option>
                          <option value="Expense">Expense</option>
                        </select>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Modal Footer Actions -->
          <div class="modal-footer">
            <button type="button" class="btn-modal-save" (click)="saveAccount()">SAVE</button>
            <button type="button" class="btn-modal-cancel" (click)="closeModal()">CANCEL</button>
          </div>
        </div>
      </div>

      <app-confirm-dialog
        [isOpen]="isDeleteModalOpen"
        title="Delete Account"
        [message]="'Are you sure you want to delete ' + (accountToDelete?.name || '') + '?'"
        confirmText="Delete"
        (confirmEvent)="confirmDelete()"
        (cancelEvent)="isDeleteModalOpen = false; accountToDelete = null"
      ></app-confirm-dialog>
    </div>
  `,
  styles: [`
    .accounts-page-container {
      padding: 1.75rem 2.25rem;
      background-color: #f8fafc;
      min-height: calc(100vh - 56px);
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    .accounts-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .page-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
      letter-spacing: -0.02em;
    }

    .btn-create {
      background-color: #16a34a;
      color: #ffffff;
      font-weight: 700;
      font-size: 0.8125rem;
      letter-spacing: 0.05em;
      padding: 0.55rem 1.4rem;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      transition: background-color 0.15s ease;
    }

    .btn-create:hover {
      background-color: #15803d;
    }

    /* Table Card */
    .table-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
    }

    .accounts-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    .accounts-table thead tr {
      background-color: #ffffff;
      border-bottom: 1px solid #f1f5f9;
    }

    .accounts-table th {
      padding: 0.95rem 1.25rem;
      font-size: 0.8125rem;
      font-weight: 600;
      color: #475569;
    }

    .accounts-table tbody tr {
      border-bottom: 1px solid #f1f5f9;
      transition: background-color 0.15s ease;
    }

    .accounts-table tbody tr:last-child {
      border-bottom: none;
    }

    .accounts-table tbody tr:hover {
      background-color: #fafbfc;
    }

    .accounts-table td {
      padding: 1.1rem 1.25rem;
      font-size: 0.85rem;
      color: #334155;
    }

    .font-bold {
      font-weight: 600;
    }

    .text-dark {
      color: #1e293b;
    }

    .text-secondary {
      color: #64748b;
    }

    .empty-state {
      text-align: center;
      padding: 2.5rem;
      color: #94a3b8;
    }

    /* Action Buttons (Square with rounded corners matching screenshot) */
    .btn-action-edit,
    .btn-action-delete {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: none;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .btn-purple {
      background-color: #7c3aed;
      color: #ffffff;
    }
    .btn-purple:hover {
      background-color: #6d28d9;
    }

    .btn-blue {
      background-color: #2563eb;
      color: #ffffff;
    }
    .btn-blue:hover {
      background-color: #1d4ed8;
    }

    .btn-white-border {
      background-color: #ffffff;
      border: 1px solid #cbd5e1;
      color: #64748b;
    }
    .btn-white-border:hover {
      border-color: #ef4444;
      color: #ef4444;
      background-color: #fef2f2;
    }

    .btn-amber-brown {
      background-color: #c2410c;
      color: #ffffff;
    }
    .btn-amber-brown:hover {
      background-color: #9a3412;
    }

    /* Modal Backdrop & Dialog */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background-color: rgba(15, 23, 42, 0.45);
      backdrop-filter: blur(2px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1.5rem;
      animation: fadeIn 0.15s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .modal-dialog {
      background: #ffffff;
      width: 620px;
      max-width: 95vw;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25);
      animation: zoomIn 0.15s ease-out;
    }

    @keyframes zoomIn {
      from { opacity: 0; transform: scale(0.97); }
      to { opacity: 1; transform: scale(1); }
    }

    .modal-header {
      background-color: #2563eb;
      color: #ffffff;
      padding: 0.9rem 1.35rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .modal-title {
      font-size: 1.05rem;
      font-weight: 700;
      margin: 0;
      color: #ffffff;
    }

    .modal-close-btn {
      background: transparent;
      border: none;
      color: #ffffff;
      font-size: 1.15rem;
      font-weight: 700;
      cursor: pointer;
      line-height: 1;
      opacity: 0.85;
      padding: 0.2rem;
    }

    .modal-close-btn:hover {
      opacity: 1;
    }

    .modal-body {
      padding: 1.5rem 1.6rem;
      display: flex;
      flex-direction: column;
      gap: 1.1rem;
      max-height: 75vh;
      overflow-y: auto;
    }

    .form-row {
      display: grid;
      grid-template-columns: 120px 1fr;
      align-items: center;
      gap: 1rem;
    }

    .form-label {
      font-size: 0.8125rem;
      font-weight: 600;
      color: #334155;
    }

    .form-input {
      width: 100%;
      height: 38px;
      padding: 0 0.85rem;
      font-size: 0.85rem;
      color: #1e293b;
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      box-sizing: border-box;
      outline: none;
      transition: border-color 0.15s ease;
    }

    .form-input:focus {
      border-color: #3b82f6;
    }

    .form-input::placeholder {
      color: #94a3b8;
    }

    .branches-section {
      margin-top: 0.4rem;
    }

    .section-title {
      font-size: 0.8125rem;
      font-weight: 600;
      color: #334155;
      margin-bottom: 0.7rem;
    }

    .branches-table-box {
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      overflow: hidden;
    }

    .branches-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    .branches-table thead tr {
      background-color: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
    }

    .branches-table th {
      padding: 0.65rem 0.85rem;
      font-size: 0.8rem;
      font-weight: 600;
      color: #475569;
    }

    .branches-table tbody tr {
      border-bottom: 1px solid #f1f5f9;
    }

    .branches-table tbody tr:last-child {
      border-bottom: none;
    }

    .branches-table td {
      padding: 0.55rem 0.85rem;
      font-size: 0.825rem;
      color: #334155;
      vertical-align: middle;
    }

    .form-checkbox {
      width: 16px;
      height: 16px;
      accent-color: #2563eb;
      cursor: pointer;
    }

    .branch-name {
      font-weight: 500;
      color: #1e293b;
    }

    .branch-input {
      width: 100%;
      height: 32px;
      padding: 0 0.6rem;
      font-size: 0.825rem;
      color: #1e293b;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      box-sizing: border-box;
      outline: none;
    }

    .branch-input:focus {
      border-color: #3b82f6;
    }

    .branch-select {
      width: 100%;
      height: 32px;
      padding: 0 0.5rem;
      font-size: 0.825rem;
      color: #1e293b;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      box-sizing: border-box;
      outline: none;
      cursor: pointer;
    }

    .branch-select:focus {
      border-color: #3b82f6;
    }

    /* Modal Footer */
    .modal-footer {
      padding: 1rem 1.6rem;
      display: flex;
      justify-content: center;
      gap: 0.85rem;
      border-top: 1px solid #f1f5f9;
      background-color: #ffffff;
    }

    .btn-modal-save {
      background-color: #16a34a;
      color: #ffffff;
      font-weight: 700;
      font-size: 0.8125rem;
      letter-spacing: 0.05em;
      padding: 0.55rem 1.75rem;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      transition: background-color 0.15s ease;
    }

    .btn-modal-save:hover {
      background-color: #15803d;
    }

    .btn-modal-cancel {
      background-color: #ffffff;
      color: #334155;
      font-weight: 700;
      font-size: 0.8125rem;
      letter-spacing: 0.05em;
      padding: 0.55rem 1.75rem;
      border-radius: 4px;
      border: 1px solid #cbd5e1;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .btn-modal-cancel:hover {
      background-color: #f8fafc;
      border-color: #94a3b8;
    }
  `]
})
export class AccountsComponent implements OnInit {
  accounts: Account[] = [];
  isModalOpen = false;
  isEditMode = false;

  currentAccount: {
    id: string;
    name: string;
    details: string;
    description: string;
  } = {
    id: '',
    name: '',
    details: '',
    description: ''
  };

  branchRows: BranchAccountConfig[] = [];
  private branchNames: string[] = [];

  constructor(private mockDataService: DataService) {}

  ngOnInit() {
    this.mockDataService.getAccounts().subscribe(acc => {
      this.accounts = acc;
    });
    this.mockDataService.getBranches().subscribe(branches => {
      this.branchNames = branches.map(b => b.name);
      this.branchRows = this.branchNames.map(name => ({ branch: name, selected: false, opening: 0, type: '' }));
    });
  }

  getEditBadgeClass(index: number): string {
    if (index === 1) return 'btn-blue';
    return 'btn-purple';
  }

  getDeleteBadgeClass(index: number): string {
    if (index === 1) return 'btn-amber-brown';
    return 'btn-white-border';
  }

  openCreateModal() {
    this.isEditMode = false;
    this.currentAccount = {
      id: '',
      name: '',
      details: '',
      description: ''
    };
    this.resetBranchRows();
    this.isModalOpen = true;
  }

  openEditModal(acc: Account) {
    this.isEditMode = true;
    this.currentAccount = {
      id: acc.id,
      name: acc.name,
      details: acc.details || '',
      description: acc.description || ''
    };
    this.resetBranchRows();
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  resetBranchRows() {
    this.branchRows = this.branchNames.map(name => ({ branch: name, selected: false, opening: 0, type: '' }));
  }

  saveAccount() {
    if (!this.currentAccount.name.trim()) return;

    if (this.isEditMode) {
      const idx = this.accounts.findIndex(a => a.id === this.currentAccount.id);
      if (idx !== -1) {
        this.accounts[idx] = {
          ...this.accounts[idx],
          name: this.currentAccount.name,
          details: this.currentAccount.details,
          description: this.currentAccount.description,
          branchConfigs: [...this.branchRows]
        };
        this.mockDataService.updateAccount(this.currentAccount.id, {
          name: this.currentAccount.name,
          type: this.accounts[idx].type || ''
        });
      }
    } else {
      const newAcc = this.mockDataService.addAccount({
        name: this.currentAccount.name,
        details: this.currentAccount.details,
        description: this.currentAccount.description,
        type: 'Bank',
        openingBalance: 0,
        currentBalance: 0,
        status: 'Active',
        branchConfigs: [...this.branchRows]
      });
      this.accounts.push(newAcc);
    }

    this.closeModal();
  }

  isDeleteModalOpen = false;
  accountToDelete: Account | null = null;

  deleteAccount(acc: Account) {
    this.accountToDelete = acc;
    this.isDeleteModalOpen = true;
  }

  confirmDelete() {
    if (this.accountToDelete) {
      this.mockDataService.deleteAccount(this.accountToDelete.id);
      this.accounts = this.accounts.filter(a => a.id !== this.accountToDelete!.id);
    }
    this.isDeleteModalOpen = false;
    this.accountToDelete = null;
  }
}
