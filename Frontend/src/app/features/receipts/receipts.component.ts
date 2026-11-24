import { IconComponent, ModalComponent, ConfirmDialogComponent, PageHeaderComponent, PaginationComponent, FilterBarComponent } from '../../shared/index';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MockDataService, Receipt, Student, Branch, CompanyInfo } from '../../core/mock-data.service';

@Component({
  selector: 'app-receipts',
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
      title="Receipt Management"
      icon="receipt"
      [breadcrumbs]="[{ label: 'Accounts' }, { label: 'Receipt Management' }]"
    >
      <button type="button" class="btn btn-primary" (click)="openCollectModal()">
        <app-icon name="plus" [size]="16"></app-icon>
        <span>Collect New Receipt</span>
      </button>
    </app-page-header>

    <!-- Filters -->
    <app-filter-bar
      placeholder="Search receipts by receipt no, student name or reference..."
      (search)="onSearch($event)"
      (export)="exportData()"
    >
      <div filters class="filter-group">
        <select class="form-select" [(ngModel)]="selectedMode" (ngModelChange)="applyFilters()">
          <option value="">All Payment Modes</option>
          <option value="Cash">Cash</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="UPI">UPI</option>
          <option value="Cheque">Cheque</option>
        </select>

        <select class="form-select" [(ngModel)]="selectedBranch" (ngModelChange)="applyFilters()">
          <option value="">All Branches</option>
          <option *ngFor="let b of branches" [value]="b.name">{{ b.name }}</option>
        </select>
      </div>
    </app-filter-bar>

    <!-- Receipts Table -->
    <div class="card">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Receipt No</th>
              <th>Date</th>
              <th>Student Name</th>
              <th>Course</th>
              <th>Branch</th>
              <th>Mode</th>
              <th>Reference No</th>
              <th style="text-align: right;">Amount (₹)</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let r of pagedReceipts; let i = index">
              <td>{{ (currentPage - 1) * pageSize + i + 1 }}</td>
              <td><strong>{{ r.receiptNo }}</strong></td>
              <td>{{ r.date }}</td>
              <td>
                <div style="font-weight: 600;">{{ r.studentName }}</div>
                <small style="color: var(--text-muted);">{{ r.studentId }}</small>
              </td>
              <td>{{ r.course }}</td>
              <td>{{ r.branch.split(' - ')[0] }}</td>
              <td><span class="badge badge-primary">{{ r.paymentMode }}</span></td>
              <td>{{ r.referenceNo || '-' }}</td>
              <td style="text-align: right; font-weight: 700; color: var(--color-primary);">
                ₹{{ r.amount | number }}
              </td>
              <td style="text-align: right;">
                <div class="table-actions" style="justify-content: flex-end;">
                  <button type="button" class="btn btn-sm btn-secondary" (click)="openPrintModal(r)" title="View Receipt">
                    <app-icon name="printer" [size]="14"></app-icon>
                  </button>
                  <button type="button" class="btn btn-sm btn-danger" (click)="openDeleteConfirm(r)" title="Delete">
                    <app-icon name="trash-2" [size]="14"></app-icon>
                  </button>
                </div>
              </td>
            </tr>
            <tr *ngIf="filteredReceipts.length === 0">
              <td colspan="10" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                No receipts found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <app-pagination
        [totalItems]="filteredReceipts.length"
        [pageSize]="pageSize"
        [currentPage]="currentPage"
        (pageChange)="currentPage = $event"
      ></app-pagination>
    </div>

    <!-- Collect Receipt Modal -->
    <app-modal
      [isOpen]="isCollectModalOpen"
      title="Collect Fee & Generate Receipt"
      size="lg"
      (closeEvent)="isCollectModalOpen = false"
      (confirmEvent)="saveCollectReceipt()"
      confirmText="Collect & Print"
    >
      <div modal-body>
        <div class="form-grid-3">
          <div class="form-group full-width">
            <label class="form-label required">Select Enrolled Student</label>
            <select
              class="form-select"
              [(ngModel)]="collectForm.selectedStudentName"
              (ngModelChange)="onStudentSelect($event)"
            >
              <option value="" disabled>-- Select Student --</option>
              <option *ngFor="let s of students" [value]="s.name">
                {{ s.name }} ({{ s.code }}) - {{ s.course }} [Bal: ₹{{ (s.feesTotal - s.feesPaid) | number }}]
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label required">Receipt Date</label>
            <input type="date" class="form-control" [(ngModel)]="collectForm.date" />
          </div>

          <div class="form-group">
            <label class="form-label required">Payment Mode</label>
            <select class="form-select" [(ngModel)]="collectForm.paymentMode">
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="UPI">UPI</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label required">Amount (₹)</label>
            <input type="number" class="form-control" [(ngModel)]="collectForm.amount" />
          </div>

          <div class="form-group">
            <label class="form-label">Reference / Txn ID</label>
            <input type="text" class="form-control" [(ngModel)]="collectForm.referenceNo" placeholder="Txn ref" />
          </div>

          <div class="form-group" style="grid-column: span 2;">
            <label class="form-label">Remarks</label>
            <input type="text" class="form-control" [(ngModel)]="collectForm.remark" placeholder="e.g. Installment payment" />
          </div>
        </div>
      </div>
    </app-modal>

    <!-- Printable Receipt Modal -->
    <app-modal
      [isOpen]="isPrintModalOpen"
      title="Fee Receipt Preview"
      size="lg"
      (closeEvent)="isPrintModalOpen = false"
      (confirmEvent)="printReceipt()"
      confirmText="Print"
      cancelText="Close"
    >
      <div modal-body *ngIf="previewReceipt" class="receipt-paper">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--color-primary); padding-bottom: 0.75rem; margin-bottom: 1rem;">
          <div>
            <h2 style="font-size: 1.15rem; color: var(--color-primary); font-weight: 700;">{{ companyInfo?.name }}</h2>
            <p style="font-size: 0.75rem; color: var(--text-secondary);">{{ companyInfo?.address }}, {{ companyInfo?.city }}</p>
          </div>
          <span class="badge badge-primary" style="font-size: 0.85rem; padding: 0.4rem 0.8rem;">RECEIPT: {{ previewReceipt.receiptNo }}</span>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; font-size: 0.85rem;">
          <div>
            <strong>Student:</strong> {{ previewReceipt.studentName }} ({{ previewReceipt.studentId }})<br />
            <strong>Course:</strong> {{ previewReceipt.course }}
          </div>
          <div style="text-align: right;">
            <strong>Date:</strong> {{ previewReceipt.date }}<br />
            <strong>Mode:</strong> {{ previewReceipt.paymentMode }}
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; font-size: 0.85rem;">
          <thead>
            <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
              <th style="padding: 0.6rem; text-align: left;">Particulars</th>
              <th style="padding: 0.6rem; text-align: right;">Amount (INR)</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 0.6rem;">Tuition & Training Fees ({{ previewReceipt.remark || 'Term Fee' }})</td>
              <td style="padding: 0.6rem; text-align: right; font-weight: 700;">₹{{ previewReceipt.amount | number }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </app-modal>

    <!-- Delete Confirmation Dialog -->
    <app-confirm-dialog
      [isOpen]="isDeleteModalOpen"
      title="Delete Receipt"
      [message]="'Are you sure you want to delete receipt ' + receiptToDelete?.receiptNo + '?'"
      (confirmEvent)="confirmDelete()"
      (cancelEvent)="isDeleteModalOpen = false"
    ></app-confirm-dialog>
  `
})
export class ReceiptsComponent implements OnInit {
  allReceipts: Receipt[] = [];
  filteredReceipts: Receipt[] = [];
  branches: Branch[] = [];
  students: Student[] = [];
  companyInfo: CompanyInfo | null = null;

  searchTerm = '';
  selectedMode = '';
  selectedBranch = '';

  currentPage = 1;
  pageSize = 5;

  isCollectModalOpen = false;
  isPrintModalOpen = false;
  isDeleteModalOpen = false;
  previewReceipt: Receipt | null = null;
  receiptToDelete: Receipt | null = null;

  collectForm = {
    selectedStudentName: '',
    selectedStudent: null as Student | null,
    date: new Date().toISOString().slice(0, 10),
    paymentMode: 'Cash' as const,
    amount: 10000,
    referenceNo: '',
    remark: 'Course Fee Payment'
  };

  constructor(private mockDataService: MockDataService) {}

  ngOnInit() {
    this.mockDataService.getReceipts().subscribe(r => {
      this.allReceipts = r;
      this.applyFilters();
    });
    this.mockDataService.getBranches().subscribe(b => this.branches = b);
    this.mockDataService.getStudents().subscribe(s => this.students = s);
    this.mockDataService.getCompanyInfo().subscribe(c => this.companyInfo = c);
  }

  onStudentSelect(studentName: string) {
    const s = this.students.find(st => st.name === studentName);
    if (s) {
      this.collectForm.selectedStudent = s;
      const bal = s.feesTotal - s.feesPaid;
      this.collectForm.amount = bal > 0 ? bal : 5000;
    }
  }

  onSearch(term: string) {
    this.searchTerm = term.toLowerCase();
    this.applyFilters();
  }

  applyFilters() {
    this.filteredReceipts = this.allReceipts.filter(r => {
      const matchesSearch =
        !this.searchTerm ||
        r.receiptNo.toLowerCase().includes(this.searchTerm) ||
        r.studentName.toLowerCase().includes(this.searchTerm) ||
        (r.referenceNo && r.referenceNo.toLowerCase().includes(this.searchTerm));

      const matchesMode = !this.selectedMode || r.paymentMode === this.selectedMode;
      const matchesBranch = !this.selectedBranch || r.branch === this.selectedBranch;

      return matchesSearch && matchesMode && matchesBranch;
    });
    this.currentPage = 1;
  }

  get pagedReceipts(): Receipt[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredReceipts.slice(start, start + this.pageSize);
  }

  openCollectModal() {
    this.collectForm = {
      selectedStudentName: '',
      selectedStudent: null,
      date: new Date().toISOString().slice(0, 10),
      paymentMode: 'Cash',
      amount: 10000,
      referenceNo: '',
      remark: 'Course Fee'
    };
    this.isCollectModalOpen = true;
  }

  saveCollectReceipt() {
    if (!this.collectForm.selectedStudent) return;
    const r = this.mockDataService.addReceipt({
      date: this.collectForm.date,
      studentId: this.collectForm.selectedStudent.code,
      studentName: this.collectForm.selectedStudent.name,
      course: this.collectForm.selectedStudent.course,
      branch: this.collectForm.selectedStudent.branch,
      amount: Number(this.collectForm.amount),
      paymentMode: this.collectForm.paymentMode,
      referenceNo: this.collectForm.referenceNo,
      remark: this.collectForm.remark
    });
    this.isCollectModalOpen = false;
    this.openPrintModal(r);
  }

  openPrintModal(r: Receipt) {
    this.previewReceipt = r;
    this.isPrintModalOpen = true;
  }

  printReceipt() {
    window.print();
  }

  openDeleteConfirm(r: Receipt) {
    this.receiptToDelete = r;
    this.isDeleteModalOpen = true;
  }

  confirmDelete() {
    if (this.receiptToDelete) {
      this.mockDataService.deleteReceipt(this.receiptToDelete.id);
      this.isDeleteModalOpen = false;
      this.receiptToDelete = null;
    }
  }

  exportData() {
    const csvContent = 'data:text/csv;charset=utf-8,' +
      'ReceiptNo,Date,Student,Course,Branch,Mode,Reference,Amount\n' +
      this.filteredReceipts.map(r => `${r.receiptNo},${r.date},"${r.studentName}","${r.course}","${r.branch}",${r.paymentMode},"${r.referenceNo || ''}",${r.amount}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Receipts_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
