import { IconComponent, ModalComponent, ConfirmDialogComponent, PageHeaderComponent, } from '../../shared/index';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService, SettingItem } from '../../core/mock-data.service';

@Component({
  selector: 'app-enquiry-sources',
  standalone: true,
  imports: [
    PageHeaderComponent,
    CommonModule,
    FormsModule,
    ModalComponent,
    ConfirmDialogComponent,
    IconComponent
  ],
  template: `
    <app-page-header
      title="Enquiry Sources"
      icon="settings"
      [breadcrumbs]="[{ label: 'Settings' }, { label: 'Enquiry Source' }]"
    >
      <button type="button" class="btn btn-primary" (click)="openAddModal()">
        <app-icon name="plus" [size]="16"></app-icon>
        <span>Add Enquiry Source</span>
      </button>
    </app-page-header>

    <div class="card">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Code</th>
              <th>Source Name</th>
              <th>Description</th>
              <th>Status</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of items; let i = index">
              <td>{{ i + 1 }}</td>
              <td><strong>{{ item.code }}</strong></td>
              <td><strong>{{ item.name }}</strong></td>
              <td>{{ item.description || '-' }}</td>
              <td><span class="badge badge-success">{{ item.status }}</span></td>
              <td style="text-align: right;">
                <div class="table-actions" style="justify-content: flex-end;">
                  <button type="button" class="btn btn-sm btn-danger" (click)="openDeleteConfirm(item)" title="Delete">
                    <app-icon name="trash-2" [size]="14"></app-icon>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <app-modal
      [isOpen]="isModalOpen"
      title="Add Enquiry Source"
      (closeEvent)="isModalOpen = false"
      (confirmEvent)="saveItem()"
    >
      <div modal-body>
        <div class="form-grid-2">
          <div class="form-group full-width">
            <label class="form-label required">Source Name</label>
            <input type="text" class="form-control" [(ngModel)]="currentForm.name" placeholder="e.g. Education Fair Expo" />
          </div>
          <div class="form-group full-width">
            <label class="form-label">Description</label>
            <input type="text" class="form-control" [(ngModel)]="currentForm.description" placeholder="Brief channel details" />
          </div>
        </div>
      </div>
    </app-modal>

    <!-- Delete Confirmation -->
    <app-confirm-dialog
      [isOpen]="isDeleteModalOpen"
      title="Delete Source"
      [message]="'Are you sure you want to delete ' + itemToDelete?.name + '?'"
      (confirmEvent)="confirmDelete()"
      (cancelEvent)="isDeleteModalOpen = false"
    ></app-confirm-dialog>
  `
})
export class EnquirySourcesComponent implements OnInit {
  items: SettingItem[] = [];
  isModalOpen = false;
  isDeleteModalOpen = false;
  itemToDelete: SettingItem | null = null;

  currentForm = { name: '', description: '', status: 'Active' as const };

  constructor(private mockDataService: MockDataService) {}

  ngOnInit() {
    this.mockDataService.getEnquirySources().subscribe(i => this.items = i);
  }

  openAddModal() {
    this.currentForm = { name: '', description: '', status: 'Active' };
    this.isModalOpen = true;
  }

  saveItem() {
    this.mockDataService.addSetting('enquiry', this.currentForm);
    this.isModalOpen = false;
  }

  openDeleteConfirm(item: SettingItem) {
    this.itemToDelete = item;
    this.isDeleteModalOpen = true;
  }

  confirmDelete() {
    if (this.itemToDelete) {
      this.mockDataService.deleteSetting('enquiry', this.itemToDelete.id);
      this.isDeleteModalOpen = false;
      this.itemToDelete = null;
    }
  }
}
