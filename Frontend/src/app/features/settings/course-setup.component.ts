import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../shared/components/icon.component';
import { ConfirmDialogComponent } from '../../shared/components/modal.component';
import { DataService, CourseItem } from '../../core/data.service';

@Component({
  selector: 'app-course-setup',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, ConfirmDialogComponent],
  template: `
    <div class="course-page-container">
      <!-- Header -->
      <div class="course-header">
        <h1 class="page-title">Course</h1>
        <button type="button" class="btn-create" (click)="openCreateModal()">CREATE</button>
      </div>

      <!-- Course Table Card -->
      <div class="table-card">
        <table class="course-table">
          <thead>
            <tr>
              <th style="width: 70px;">Sl No</th>
              <th>Course</th>
              <th style="width: 140px;">Fees</th>
              <th style="width: 80px; text-align: center;">Edit</th>
              <th style="width: 80px; text-align: center;">Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of courses; let i = index">
              <td class="text-secondary">{{ c.slNo }}</td>
              <td class="font-bold text-dark">{{ c.name }}</td>
              <td class="text-dark">{{ c.fees }}</td>
              <td style="text-align: center;">
                <button
                  type="button"
                  class="btn-action-edit"
                  [ngClass]="getEditClass(i)"
                  (click)="openEditModal(c)"
                  title="Edit Course"
                >
                  <app-icon name="edit" [size]="14"></app-icon>
                </button>
              </td>
              <td style="text-align: center;">
                <button
                  type="button"
                  class="btn-action-delete"
                  [ngClass]="getDeleteClass(i)"
                  (click)="deleteCourse(c)"
                  title="Delete Course"
                >
                  <app-icon name="trash-2" [size]="14"></app-icon>
                </button>
              </td>
            </tr>
            <tr *ngIf="courses.length === 0">
              <td colspan="5" class="empty-state">No courses available.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Create / Edit Course Modal -->
      <div class="modal-backdrop" *ngIf="isModalOpen" (click)="closeModal()">
        <div class="modal-dialog" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">{{ isEditMode ? 'Edit Course' : 'New Course' }}</h3>
            <button type="button" class="modal-close-btn" (click)="closeModal()">✕</button>
          </div>

          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Course Name</label>
              <input
                type="text"
                class="form-input"
                [(ngModel)]="courseForm.name"
                placeholder="Enter course name"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Course Fee</label>
              <input
                type="number"
                class="form-input"
                [(ngModel)]="courseForm.fees"
                placeholder="0"
              />
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-modal-save" (click)="saveCourse()">SAVE</button>
            <button type="button" class="btn-modal-cancel" (click)="closeModal()">CANCEL</button>
          </div>
        </div>
      </div>

      <app-confirm-dialog
        [isOpen]="isDeleteModalOpen"
        title="Delete Course"
        [message]="'Are you sure you want to delete ' + (courseToDelete?.name || '') + '?'"
        confirmText="Delete"
        (confirmEvent)="confirmDelete()"
        (cancelEvent)="isDeleteModalOpen = false; courseToDelete = null"
      ></app-confirm-dialog>
    </div>
  `,
  styles: [`
    .course-page-container {
      padding: 1.75rem 2.25rem;
      background-color: #f8fafc;
      min-height: calc(100vh - 56px);
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    .course-header {
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

    .table-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
    }

    .course-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    .course-table thead tr {
      background-color: #ffffff;
      border-bottom: 1px solid #f1f5f9;
    }

    .course-table th {
      padding: 0.95rem 1.25rem;
      font-size: 0.8125rem;
      font-weight: 600;
      color: #475569;
    }

    .course-table tbody tr {
      border-bottom: 1px solid #f1f5f9;
    }

    .course-table tbody tr:last-child {
      border-bottom: none;
    }

    .course-table tbody tr:hover {
      background-color: #fafbfc;
    }

    .course-table td {
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
      border: none;
      color: #ffffff;
    }

    .btn-purple:hover {
      background-color: #6d28d9;
    }

    .btn-blue {
      background-color: #2563eb;
      border: none;
      color: #ffffff;
    }

    .btn-blue:hover {
      background-color: #1d4ed8;
    }

    .btn-del-white {
      background-color: #ffffff;
      border: 1px solid #cbd5e1;
      color: #64748b;
    }

    .btn-del-white:hover {
      border-color: #ef4444;
      color: #ef4444;
      background-color: #fef2f2;
    }

    .btn-del-brown {
      background-color: #c2410c;
      border: none;
      color: #ffffff;
    }

    .btn-del-brown:hover {
      background-color: #9a3412;
    }

    .empty-state {
      text-align: center;
      padding: 2.5rem;
      color: #94a3b8;
    }

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
      width: 580px;
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

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
    }

    .form-label {
      font-size: 0.8125rem;
      font-weight: 600;
      color: #334155;
    }

    .form-input,
    .form-select {
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
    }

    .form-input:focus,
    .form-select:focus {
      border-color: #3b82f6;
    }

    .modal-footer {
      padding: 1rem 1.6rem;
      display: flex;
      justify-content: flex-start;
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
export class CourseSetupComponent implements OnInit {
  courses: CourseItem[] = [];

  getEditClass(index: number): string {
    return index % 2 === 1 ? 'btn-blue' : 'btn-purple';
  }

  getDeleteClass(index: number): string {
    return index % 2 === 1 ? 'btn-del-brown' : 'btn-del-white';
  }

  isModalOpen = false;
  isEditMode = false;
  editingCourseSlNo: number | null = null;

  courseForm = {
    name: '',
    fees: 0
  };

  constructor(private mockDataService: DataService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.mockDataService.getCourseItems().subscribe(data => {
      this.courses = data;
      this.cdr.markForCheck();
    });
  }

  openCreateModal() {
    this.isEditMode = false;
    this.editingCourseSlNo = null;
    this.courseForm = {
      name: '',
      fees: 0
    };
    this.isModalOpen = true;
  }

  openEditModal(c: CourseItem) {
    this.isEditMode = true;
    this.editingCourseSlNo = c.slNo;
    this.courseForm = {
      name: c.name,
      fees: c.fees
    };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveCourse() {
    if (!this.courseForm.name.trim()) return;

    if (this.isEditMode && this.editingCourseSlNo !== null) {
      const targetSlNo = this.editingCourseSlNo;
      this.courses = this.courses.map(c => c.slNo === targetSlNo ? {
        ...c,
        name: this.courseForm.name,
        fees: this.courseForm.fees
      } : c);
      this.cdr.markForCheck();
      this.mockDataService.updateCourseItem(targetSlNo, {
        name: this.courseForm.name,
        fees: this.courseForm.fees,
        status: 'Active'
      });
    } else {
      const tempSlNo = this.courses.length > 0 ? Math.max(...this.courses.map(c => c.slNo)) + 1 : 1;
      this.courses = [...this.courses, {
        slNo: tempSlNo,
        name: this.courseForm.name,
        department: '',
        duration: '',
        fees: this.courseForm.fees,
        hasDelete: true,
        hasEdit: true,
        status: 'Active'
      }];
      this.cdr.markForCheck();
      this.mockDataService.addCourseItem({
        name: this.courseForm.name,
        department: '',
        duration: '',
        fees: this.courseForm.fees,
        hasDelete: true,
        hasEdit: true,
        status: 'Active'
      });
    }

    this.closeModal();
  }

  isDeleteModalOpen = false;
  courseToDelete: CourseItem | null = null;

  deleteCourse(c: CourseItem) {
    this.courseToDelete = c;
    this.isDeleteModalOpen = true;
  }

  confirmDelete() {
    if (this.courseToDelete) {
      const targetSlNo = this.courseToDelete.slNo;
      this.courses = this.courses.filter(c => c.slNo !== targetSlNo);
      this.cdr.markForCheck();
      this.mockDataService.deleteCourseItem(targetSlNo);
    }
    this.isDeleteModalOpen = false;
    this.courseToDelete = null;
  }
}
