import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ConfirmDialogComponent, ModalComponent } from '../../shared/components/modal.component';
import { DataService, CourseItem, EnquirySourceItem, StatusItem, FollowupTypeItem, Account } from '../../core/data.service';
import { NotificationService } from '../../core/notification.service';

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ConfirmDialogComponent, ModalComponent],
  template: `
    <div class="student-detail-page">
      <!-- Top Sub-Navigation Tabs & Student Name Header (Only for Student Profile: Details & Course) -->
      <div class="student-tabs-bar" *ngIf="activeTab !== 'followup'">
        <div class="tabs-group">
          <button
            type="button"
            class="tab-btn"
            [class.active]="activeTab === 'details'"
            (click)="setTab('details')"
          >
            <svg class="tab-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>Student Details</span>
          </button>

          <button
            type="button"
            class="tab-btn"
            [class.active]="activeTab === 'course'"
            (click)="setTab('course')"
          >
            <svg class="tab-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
              <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
            </svg>
            <span>Course</span>
          </button>
        </div>

        <div class="student-name-badge">
          {{ studentName }}
        </div>
      </div>

      <!-- ========================================== -->
      <!-- TAB 1: Student Details (Screenshot 1)      -->
      <!-- ========================================== -->
      <div *ngIf="activeTab === 'details'">
        <h1 class="page-heading">Student Details</h1>

        <div class="panel-box">
          <div class="panel-body">
            <div class="form-columns-2">
              <!-- Left Column -->
              <div class="column-group">
                <div class="field-row">
                  <label class="field-label required">Enquiry Source</label>
                  <div class="field-control">
                    <select class="input-select" [(ngModel)]="details.enquirySource">
                      <option *ngFor="let s of enquirySources" [value]="s.name">{{ s.name }}</option>
                    </select>
                  </div>
                </div>

                <div class="field-row">
                  <label class="field-label required">Enquiry Type</label>
                  <div class="field-control">
                    <select class="input-select" [(ngModel)]="details.enquiryType">
                      <option value="">Select</option>
                      <option *ngFor="let t of enquiryTypes" [value]="t">{{ t }}</option>
                    </select>
                  </div>
                </div>

                <div class="field-row">
                  <label class="field-label required">Name</label>
                  <div class="field-control">
                    <input type="text" class="input-text" [(ngModel)]="details.name" />
                  </div>
                </div>

                <div class="field-row">
                  <label class="field-label required">Mobile</label>
                  <div class="field-control">
                    <input type="text" class="input-text" [(ngModel)]="details.mobile" />
                  </div>
                </div>

                <div class="field-row">
                  <label class="field-label required">Parents Mobile</label>
                  <div class="field-control">
                    <input type="text" class="input-text" [(ngModel)]="details.parentsMobile" />
                  </div>
                </div>

                <div class="field-row">
                  <label class="field-label">Note</label>
                  <div class="field-control">
                    <input type="text" class="input-text" [(ngModel)]="details.note" />
                  </div>
                </div>
              </div>

              <!-- Right Column -->
              <div class="column-group">
                <div class="field-row">
                  <label class="field-label">Facebook</label>
                  <div class="field-control">
                    <input type="text" class="input-text" [(ngModel)]="details.facebook" />
                  </div>
                </div>

                <div class="field-row align-start">
                  <label class="field-label">Address</label>
                  <div class="field-control">
                    <textarea rows="2" class="input-textarea" [(ngModel)]="details.address"></textarea>
                  </div>
                </div>

                <div class="field-row">
                  <label class="field-label">Email</label>
                  <div class="field-control">
                    <input type="email" class="input-text" [(ngModel)]="details.email" />
                  </div>
                </div>

                <div class="field-row">
                  <label class="field-label">Alternative Email</label>
                  <div class="field-control">
                    <input type="email" class="input-text" [(ngModel)]="details.altEmail" />
                  </div>
                </div>

                <div class="field-row">
                  <label class="field-label">Date</label>
                  <div class="field-control">
                    <input type="date" class="input-text" [(ngModel)]="details.date" />
                  </div>
                </div>

                <div class="field-row">
                  <label class="field-label">WhatsApp</label>
                  <div class="field-control">
                    <input type="text" class="input-text" [(ngModel)]="details.whatsapp" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Footer 1 -->
        <div class="action-footer">
          <button type="button" class="btn-action btn-delete-red" (click)="onDelete()">DELETE</button>
          <button type="button" class="btn-action btn-new-blue" (click)="onNew()">NEW</button>
          <button type="button" class="btn-action btn-save-green" (click)="onSave()">SAVE</button>
          <button type="button" class="btn-action btn-savesend-purple" (click)="onSaveAndSend()">SAVE & SEND</button>
        </div>
      </div>

      <!-- ========================================== -->
      <!-- TAB 2: Course & Fee Receipt (Row-wise Side-by-Side matching Image 1) -->
      <!-- ========================================== -->
      <div *ngIf="activeTab === 'course'" class="course-tab-container">
        <div class="course-receipt-split-grid">
          <!-- 1. Left Side: Course Panel -->
          <div class="course-left-panel">
            <h3 class="panel-section-title">Course</h3>
            
            <div class="vertical-form-stack">
              <!-- 1. Course -->
              <div class="field-row">
                <label class="field-label">Course</label>
                <div class="field-control">
                  <select class="input-select" [(ngModel)]="courseData.course">
                    <option *ngFor="let c of courses" [value]="c.name">{{ c.name }}</option>
                  </select>
                </div>
              </div>

              <!-- 2. Course Type -->
              <div class="field-row">
                <label class="field-label">Course Type</label>
                <div class="field-control">
                  <select class="input-select" [(ngModel)]="courseData.courseType">
                    <option value="Select">Select</option>
                    <option *ngFor="let ct of courseTypes" [value]="ct">{{ ct }}</option>
                  </select>
                </div>
              </div>

              <!-- 3. Batch -->
              <div class="field-row">
                <label class="field-label">Batch</label>
                <div class="field-control">
                  <select class="input-select" [(ngModel)]="courseData.batch">
                    <option value="Select">Select</option>
                    <option *ngFor="let b of batches" [value]="b">{{ b }}</option>
                  </select>
                </div>
              </div>

              <!-- 4. Fees -->
              <div class="field-row">
                <label class="field-label">Fees</label>
                <div class="field-control">
                  <input
                    type="number"
                    class="input-text"
                    [(ngModel)]="courseData.fees"
                    (ngModelChange)="onFeeCalculationChange()"
                  />
                </div>
              </div>

              <!-- 5. Book Amount + Checkbox -->
              <div class="field-row">
                <label class="field-label">Book Amount</label>
                <div class="field-control book-amount-control">
                  <input
                    type="number"
                    class="input-text"
                    [(ngModel)]="courseData.bookAmount"
                    (ngModelChange)="onFeeCalculationChange()"
                  />
                  <input
                    type="checkbox"
                    class="styled-checkbox"
                    [(ngModel)]="courseData.bookAmountChecked"
                    (ngModelChange)="onFeeCalculationChange()"
                  />
                </div>
              </div>

              <!-- 6. Discount -->
              <div class="field-row">
                <label class="field-label">Discount</label>
                <div class="field-control">
                  <input
                    type="number"
                    class="input-text"
                    [(ngModel)]="courseData.discount"
                    (ngModelChange)="onFeeCalculationChange()"
                  />
                </div>
              </div>

              <!-- 7. Total Fees (Readonly / Calculated) -->
              <div class="field-row">
                <label class="field-label">Total Fees</label>
                <div class="field-control">
                  <input type="number" class="input-text readonly-input" [(ngModel)]="courseData.totalFees" readonly />
                </div>
              </div>

              <!-- 8. Status -->
              <div class="field-row">
                <label class="field-label">Status</label>
                <div class="field-control">
                  <select class="input-select" [(ngModel)]="courseData.status">
                    <option value="">Select</option>
                    <option *ngFor="let s of statuses" [value]="s.name">{{ s.name }}</option>
                  </select>
                </div>
              </div>

              <!-- 9. Exam Date Booked -->
              <div class="field-row">
                <label class="field-label">Exam Date Booked</label>
                <div class="field-control">
                  <input type="checkbox" class="styled-checkbox" [(ngModel)]="courseData.examDateBooked" />
                </div>
              </div>

              <!-- 10. Fees Payment -->
              <div class="field-row">
                <label class="field-label">Fees Payment</label>
                <div class="field-control">
                  <input type="checkbox" class="styled-checkbox" [(ngModel)]="courseData.feesPayment" />
                </div>
              </div>

              <!-- 11. Speaking Date -->
              <div class="field-row">
                <label class="field-label">Speaking Date</label>
                <div class="field-control">
                  <input type="checkbox" class="styled-checkbox" [(ngModel)]="courseData.speakingDate" />
                </div>
              </div>

              <!-- 12. Score: L R W S O -->
              <div class="field-row">
                <label class="field-label">Score</label>
                <div class="field-control score-box-row">
                  <span class="score-label">L</span>
                  <input type="number" class="score-input" [(ngModel)]="courseData.scoreL" />
                  <span class="score-label">R</span>
                  <input type="number" class="score-input" [(ngModel)]="courseData.scoreR" />
                  <span class="score-label">W</span>
                  <input type="number" class="score-input" [(ngModel)]="courseData.scoreW" />
                  <span class="score-label">S</span>
                  <input type="number" class="score-input" [(ngModel)]="courseData.scoreS" />
                  <span class="score-label">O</span>
                  <input type="number" class="score-input" [(ngModel)]="courseData.scoreO" />
                </div>
              </div>

              <!-- 13. Passport Number -->
              <div class="field-row">
                <label class="field-label">Passport Number</label>
                <div class="field-control">
                  <input type="text" class="input-text" [(ngModel)]="courseData.passportNumber" />
                </div>
              </div>

              <!-- 14. Student Id Number + Generate Button -->
              <div class="field-row">
                <label class="field-label">Student Id Number</label>
                <div class="field-control flex-row-align">
                  <input type="text" class="input-text flex-1" [(ngModel)]="courseData.studentIdNumber" />
                  <button type="button" class="btn-generate-blue" (click)="generateId()">Generate</button>
                </div>
              </div>

              <!-- 15. Photo Upload + Box -->
              <div class="field-row photo-field-row">
                <label class="field-label">Photo</label>
                <div class="field-control">
                  <input type="file" class="file-input-btn" />
                  <div class="photo-preview-placeholder"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. Right Side: Fee Receipt Panel -->
          <div class="receipt-right-panel">
            <h3 class="panel-section-title">Fee Receipt</h3>

            <!-- Add Receipt Input Line -->
            <div class="fee-receipt-input-grid">
              <div class="fee-col">
                <span class="mini-label">Receipt Date</span>
                <input type="date" class="input-text" [(ngModel)]="newReceipt.date" />
              </div>

              <div class="fee-col">
                <span class="mini-label">Fee Amount</span>
                <input type="number" class="input-text" [(ngModel)]="newReceipt.amount" />
              </div>

              <div class="fee-col">
                <span class="mini-label">Type</span>
                <select class="input-select" [(ngModel)]="newReceipt.type">
                  <option value="">Select</option>
                  <option value="Fees">Fees</option>
                  <option value="Book Amount">Book Amount</option>
                </select>
              </div>

              <div class="fee-col">
                <span class="mini-label">Account</span>
                <select class="input-select" [(ngModel)]="newReceipt.account">
                  <option value="">Select</option>
                  <option *ngFor="let acc of accounts" [value]="acc.name">{{ acc.name }}</option>
                </select>
              </div>

              <div class="fee-col flex-1">
                <span class="mini-label">Description</span>
                <input type="text" class="input-text" [(ngModel)]="newReceipt.description" />
              </div>

              <div class="fee-col-btn">
                <button type="button" class="btn-add-plus" (click)="addReceiptRow()" title="Add Receipt">+</button>
              </div>
            </div>

            <!-- Receipts Table matching exact TrackBox styling -->
            <div class="receipt-table-scroll">
              <table class="receipt-table">
                <thead>
                  <tr>
                    <th>Receipt Date</th>
                    <th>Fee Amount</th>
                    <th>Fees</th>
                    <th>Account</th>
                    <th>Description</th>
                    <th style="text-align: right; width: 100px;"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let r of receiptsList; let idx = index">
                    <td>{{ r.date }}</td>
                    <td>{{ r.amount }}</td>
                    <td>{{ r.type }}</td>
                    <td>{{ r.account }}</td>
                    <td>{{ r.description }}</td>
                    <td style="text-align: right; white-space: nowrap;">
                      <button type="button" class="icon-link-btn" (click)="editReceipt(idx)" title="Edit">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button type="button" class="icon-link-btn" (click)="deleteReceipt(idx)" title="Delete">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                      <button type="button" class="icon-link-btn" (click)="printReceipt(r)" title="Print">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="6 9 6 2 18 2 18 9"></polyline>
                          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                          <rect x="6" y="14" width="12" height="8"></rect>
                        </svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Dynamic Calculated Totals Footer -->
            <div class="receipt-totals-box">
              <div class="total-row">
                <span>Total Fee :</span>
                <strong>{{ totalReceiptsAmount }}</strong>
              </div>
              <div class="total-row">
                <span>Balance Fee :</span>
                <strong>{{ balanceFee }}</strong>
              </div>
            </div>
          </div>
        </div>

        <!-- Course Action Footer -->
        <div class="action-footer right-align-footer mt-4">
          <button type="button" class="btn-action btn-delete-red" (click)="onDelete()">DELETE</button>
          <button type="button" class="btn-action btn-new-green" (click)="onNew()">NEW</button>
          <button type="button" class="btn-action btn-save-purple" (click)="onSave()">SAVE</button>
        </div>
      </div>

      <!-- ========================================== -->
      <!-- TAB 3: Student Follow-up (Screenshot 2)    -->
      <!-- ========================================== -->
      <div *ngIf="activeTab === 'followup'">
        <div class="panel-box">
          <div class="panel-header">
            <span class="panel-title">Followup Call Status : {{ studentName }}</span>
          </div>
          <div class="panel-body">
            <div class="followup-grid-2">
              <div class="field-row">
                <label class="field-label required">Status</label>
                <div class="field-control">
                  <select class="input-select" [(ngModel)]="followupData.status">
                    <option *ngFor="let s of statuses" [value]="s.name">{{ s.name }}</option>
                  </select>
                </div>
              </div>

              <div class="field-row">
                <label class="field-label required">To staff</label>
                <div class="field-control">
                  <select class="input-select" [(ngModel)]="followupData.toStaff">
                    <option *ngFor="let staff of staffOptions" [value]="staff">{{ staff }}</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="followup-comment-row">
              <label class="field-label required">Followup Call Comments</label>
              <div class="field-control">
                <input
                  type="text"
                  class="input-text"
                  placeholder="Enter follow-up call comments"
                  [(ngModel)]="followupData.comments"
                />
              </div>
            </div>

            <div class="followup-date-row">
              <label class="field-label required">Next Follow Up Date</label>
              <div class="field-control date-control-small">
                <input type="date" class="input-text" [(ngModel)]="followupData.nextDate" />
              </div>
            </div>
          </div>
        </div>

        <!-- Follow-up Action Footer -->
        <div class="action-footer">
          <button type="button" class="btn-action btn-profile-white" (click)="setTab('details')">VIEW PROFILE</button>
          <button type="button" class="btn-action btn-history-blue" (click)="viewHistory()">HISTORY</button>
          <button type="button" class="btn-action btn-save-green" (click)="onSave()">SAVE</button>
          <button type="button" class="btn-action btn-close-purple" (click)="onClose()">CLOSE</button>
        </div>

        <!-- Follow-up History Modal -->
        <div *ngIf="showHistoryModal" class="history-modal-backdrop" (click)="closeHistoryModal()">
          <div class="history-modal-card" (click)="$event.stopPropagation()">
            <div class="history-modal-top">
              <div class="history-modal-title">Follow-up Call History : {{ studentName }}</div>
              <button type="button" class="history-modal-close" (click)="closeHistoryModal()">&times;</button>
            </div>
            <div class="history-scroll-box">
              <table class="history-grid-table">
                <thead>
                  <tr>
                    <th>Next FollowUp</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>To</th>
                    <th>From</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let h of historyList" [class.red-text]="h.isOverdue">
                    <td>{{ h.nextFollowup }}</td>
                    <td>{{ h.department }}</td>
                    <td>{{ h.status }}</td>
                    <td>{{ h.to }}</td>
                    <td>{{ h.from }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <app-confirm-dialog
        [isOpen]="isDeleteModalOpen"
        title="Delete Student"
        [message]="'Are you sure you want to delete ' + studentName + '?'"
        confirmText="Delete"
        (confirmEvent)="confirmDelete()"
        (cancelEvent)="isDeleteModalOpen = false"
      ></app-confirm-dialog>

      <app-modal
        [isOpen]="isEditReceiptModalOpen"
        title="Edit Fee Amount"
        size="sm"
        confirmText="Save"
        (confirmEvent)="saveEditReceipt()"
        (closeEvent)="isEditReceiptModalOpen = false"
      >
        <div modal-body>
          <label class="form-label" style="display: block; margin-bottom: 0.4rem;">Fee Amount</label>
          <input
            type="number"
            class="form-input"
            [(ngModel)]="editingReceiptAmount"
            style="width: 100%;"
          />
        </div>
      </app-modal>
    </div>
  `,
  styles: [`
    .student-detail-page {
      padding: 1.25rem 2rem 3rem 2rem;
      background-color: #f6f8fb;
      min-height: calc(100vh - 60px);
      font-family: inherit;
    }

    /* Sub-tabs bar matching reference */
    .student-tabs-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.25rem;
      background: transparent;
    }

    .tabs-group {
      display: flex;
      align-items: center;
      gap: 0.35rem;
    }

    .tab-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.45rem 1rem;
      font-size: 0.8125rem;
      font-weight: 500;
      color: #334155;
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      border-radius: 5px;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .tab-btn:hover {
      background: #e2e8f0;
    }

    .tab-btn.active {
      background: #ffffff;
      color: #1d4ed8;
      border-color: #cbd5e1;
      border-bottom: 2px solid #1d4ed8;
      font-weight: 600;
    }

    .tab-icon {
      color: inherit;
    }

    .student-name-badge {
      font-size: 0.82rem;
      font-weight: 700;
      color: #334155;
      letter-spacing: 0.04em;
    }

    .page-heading {
      font-size: 1.5rem;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 1.25rem;
      letter-spacing: -0.02em;
    }

    /* Panel Card */
    .panel-box {
      background: #ffffff;
      border: 1px solid #e5e9f2;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
      overflow: hidden;
      margin-bottom: 1.25rem;
    }

    .panel-header {
      padding: 0.85rem 1.25rem;
      border-bottom: 1px solid #edf2f7;
    }

    .panel-title {
      font-size: 0.92rem;
      font-weight: 600;
      color: #1e293b;
    }

    .panel-body {
      padding: 1.5rem 1.75rem;
    }

    /* 2 Columns Layout */
    .form-columns-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      column-gap: 3.5rem;
    }

    .column-group {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .field-row {
      display: grid;
      grid-template-columns: 140px 1fr;
      align-items: center;
      gap: 1rem;
    }

    .field-row.align-start {
      align-items: flex-start;
    }

    .field-label {
      font-size: 0.84rem;
      font-weight: 500;
      color: #334155;
      text-align: right;
    }

    .field-label.required::after {
      content: ' *';
      color: #ef4444;
      font-weight: 600;
    }

    .field-control {
      width: 100%;
    }

    /* Controls */
    .input-text,
    .input-select,
    .input-textarea {
      width: 100%;
      height: 38px;
      padding: 0.45rem 0.85rem;
      border: 1px solid #dce2eb;
      border-radius: 6px;
      font-size: 0.84rem;
      color: #1e293b;
      background-color: #ffffff;
      outline: none;
      box-sizing: border-box;
    }

    .input-textarea {
      height: auto;
      min-height: 52px;
      resize: vertical;
    }

    .input-select {
      cursor: pointer;
    }

    .date-input-wrap {
      position: relative;
      display: flex;
      align-items: center;
    }

    .calendar-icon {
      position: absolute;
      right: 0.75rem;
      color: #64748b;
      pointer-events: none;
    }

    .flex-row-align {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .flex-1 {
      flex: 1;
    }

    .styled-checkbox {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }

    .check-group-inline {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      flex-wrap: wrap;
    }

    .checkbox-inline {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.82rem;
      color: #334155;
      cursor: pointer;
    }

    .photo-upload-box {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .file-input-btn {
      font-size: 0.82rem;
      color: #475569;
    }

    .user-camera-btn {
      border: 1px solid #cbd5e1;
      background: #f8fafc;
      padding: 0.4rem 0.6rem;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .score-box-row {
      display: flex;
      align-items: center;
      gap: 0.65rem;
    }

    .score-label {
      font-size: 0.95rem;
      color: #0b62b6;
      font-weight: 500;
    }

    .score-input {
      width: 48px;
      height: 32px;
      padding: 0.2rem 0.4rem;
      border: 1px solid #94a3b8;
      border-radius: 2px;
      text-align: center;
      font-size: 0.85rem;
      color: #0f172a;
      background-color: #ffffff;
      outline: none;
      box-sizing: border-box;
    }

    .score-input:focus {
      border-color: #2563eb;
    }

    .btn-generate-blue {
      background-color: #1d4ed8;
      color: #ffffff;
      border: none;
      padding: 0.45rem 1rem;
      border-radius: 5px;
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
    }

    /* Action Footers */
    .action-footer {
      background: #ffffff;
      border: 1px solid #e5e9f2;
      border-radius: 8px;
      padding: 0.85rem 1.5rem;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 0.75rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
    }

    .btn-action {
      font-size: 0.82rem;
      font-weight: 600;
      padding: 0.55rem 1.5rem;
      border-radius: 5px;
      border: none;
      cursor: pointer;
      letter-spacing: 0.04em;
      transition: background-color 0.15s;
    }

    .btn-delete-red {
      background-color: #ef4444;
      color: #ffffff;
    }

    .btn-new-blue {
      background-color: #1d4ed8;
      color: #ffffff;
    }

    .btn-new-green {
      background-color: #15803d;
      color: #ffffff;
    }

    .btn-save-green {
      background-color: #15803d;
      color: #ffffff;
    }

    .btn-save-purple,
    .btn-savesend-purple {
      background-color: #6366f1;
      color: #ffffff;
    }

    .btn-profile-white {
      background-color: #ffffff;
      border: 1px solid #cbd5e1;
      color: #334155;
    }

    .btn-history-blue {
      background-color: #1d4ed8;
      color: #ffffff;
    }

    .btn-close-purple {
      background-color: #6366f1;
      color: #ffffff;
    }

    /* Fee Receipt section */
    .fee-receipt-input-grid {
      display: flex;
      align-items: flex-end;
      gap: 0.85rem;
    }

    .fee-col {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      min-width: 130px;
    }

    .mini-label {
      font-size: 0.78rem;
      font-weight: 500;
      color: #475569;
    }

    .fee-col-btn {
      padding-bottom: 2px;
    }

    /* Course & Receipt Side-by-Side Split Grid matching Image 1 */
    .course-tab-container {
      background: #ffffff;
      border: 1px solid #e5e9f2;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
    }

    .course-receipt-split-grid {
      display: grid;
      grid-template-columns: 1fr 1.15fr;
      gap: 2.5rem;
      align-items: start;
    }

    .panel-section-title {
      font-size: 1.15rem;
      font-weight: 600;
      color: #0f172a;
      margin: 0 0 1.25rem 0;
      letter-spacing: -0.01em;
    }

    .vertical-form-stack {
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
    }

    .vertical-form-stack .field-row {
      display: grid;
      grid-template-columns: 140px 1fr;
      align-items: center;
      gap: 1rem;
    }

    .book-amount-control {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .readonly-input {
      background-color: #f1f5f9;
      cursor: not-allowed;
      color: #334155;
    }

    .photo-field-row {
      align-items: flex-start !important;
    }

    .photo-preview-placeholder {
      width: 75px;
      height: 85px;
      border: 1px solid #cbd5e1;
      border-radius: 3px;
      background: #ffffff;
      margin-top: 0.5rem;
    }

    .receipt-table-scroll {
      width: 100%;
      overflow-x: auto;
      margin-top: 1.25rem;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
    }

    @media (max-width: 1100px) {
      .course-receipt-split-grid {
        grid-template-columns: 1fr;
      }
    }

    .btn-add-plus {
      background-color: #2563eb;
      color: #ffffff;
      border: none;
      width: 36px;
      height: 36px;
      border-radius: 4px;
      font-size: 1.25rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background-color 0.15s;
    }

    .btn-add-plus:hover {
      background-color: #1d4ed8;
    }

    .receipt-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.84rem;
    }

    .receipt-table thead th {
      text-align: left;
      font-weight: 600;
      background-color: #4b78a4;
      color: #ffffff;
      padding: 0.65rem 0.75rem;
      border-bottom: 1px solid #3b668d;
      font-size: 0.82rem;
    }

    .receipt-table tbody td {
      padding: 0.7rem 0.75rem;
      border-bottom: 1px solid #f1f5f9;
      font-size: 0.82rem;
      color: #1e293b;
    }

    .icon-link-btn {
      background: none;
      border: none;
      color: #64748b;
      cursor: pointer;
      margin-left: 0.4rem;
      padding: 0.2rem;
    }

    .icon-link-btn:hover {
      color: #0f172a;
    }

    .receipt-totals-box {
      margin-top: 1.5rem;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.35rem;
      font-size: 0.85rem;
      color: #1e293b;
    }

    .total-row {
      display: flex;
      gap: 1.5rem;
      min-width: 160px;
      justify-content: space-between;
    }

    /* Follow-up Tab */
    .followup-grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      column-gap: 3.5rem;
      margin-bottom: 1.25rem;
    }

    .followup-comment-row {
      display: grid;
      grid-template-columns: 180px 1fr;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.25rem;
    }

    .followup-date-row {
      display: grid;
      grid-template-columns: 180px 1fr;
      align-items: center;
      gap: 1rem;
    }

    .date-control-small {
      width: 200px;
    }

    /* History Modal & Exact Reference Table */
    .history-modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(15, 23, 42, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      padding: 1.5rem;
    }

    .history-modal-card {
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.25);
      width: 100%;
      max-width: 820px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      border: 1px solid #cbd5e1;
    }

    .history-modal-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.85rem 1.25rem;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
    }

    .history-modal-title {
      font-size: 0.95rem;
      font-weight: 600;
      color: #0f172a;
    }

    .history-modal-close {
      background: none;
      border: none;
      font-size: 1.4rem;
      line-height: 1;
      color: #64748b;
      cursor: pointer;
      padding: 0.15rem 0.5rem;
      border-radius: 4px;
    }

    .history-modal-close:hover {
      background: #e2e8f0;
      color: #0f172a;
    }

    .history-scroll-box {
      width: 100%;
      max-height: 400px;
      overflow-x: auto;
      overflow-y: auto;
      background: #ffffff;
    }

    .history-scroll-box::-webkit-scrollbar {
      width: 12px;
      height: 12px;
    }

    .history-scroll-box::-webkit-scrollbar-track {
      background: #f1f5f9;
    }

    .history-scroll-box::-webkit-scrollbar-thumb {
      background: #94a3b8;
      border-radius: 4px;
      border: 2px solid #f1f5f9;
    }

    .history-scroll-box::-webkit-scrollbar-thumb:hover {
      background: #64748b;
    }

    .history-grid-table {
      width: 100%;
      min-width: 650px;
      border-collapse: collapse;
      font-size: 0.825rem;
    }

    .history-grid-table th {
      background-color: #0b62b6;
      color: #ffffff;
      font-weight: 600;
      text-align: left;
      padding: 0.65rem 1.25rem;
      white-space: nowrap;
      position: sticky;
      top: 0;
      z-index: 2;
      border-right: 1px solid rgba(255, 255, 255, 0.2);
    }

    .history-grid-table th:last-child {
      border-right: none;
    }

    .history-grid-table td {
      padding: 0.6rem 1.25rem;
      border-bottom: 1px solid #e2e8f0;
      border-right: 1px solid #f1f5f9;
      white-space: nowrap;
      color: #0f172a;
      font-weight: 500;
    }

    .history-grid-table td:last-child {
      border-right: none;
    }

    .history-grid-table tr:hover {
      background-color: #f8fafc;
    }

    .history-grid-table tr.red-text td {
      color: #dc2626 !important; /* Exact red font matching reference image */
      font-weight: 500;
    }

    @media (max-width: 1024px) {
      .form-columns-2,
      .followup-grid-2 {
        grid-template-columns: 1fr;
      }
      .field-row,
      .followup-comment-row,
      .followup-date-row {
        grid-template-columns: 130px 1fr;
      }
      .fee-receipt-input-grid {
        flex-direction: column;
        align-items: stretch;
      }
    }
  `]
})
export class StudentDetailComponent implements OnInit {
  activeTab: 'details' | 'course' | 'followup' = 'details';
  studentName = '';

  // Tab 1: Student Details Model (filled from backend)
  details = {
    enquirySource: '',
    enquiryType: '',
    name: '',
    mobile: '',
    parentsMobile: '',
    note: '',
    facebook: '',
    address: '',
    email: '',
    altEmail: '',
    date: '',
    whatsapp: ''
  };

  // Tab 2: Course Model (filled from backend)
  courseData = {
    course: '',
    batch: '',
    bookAmount: 0,
    bookAmountChecked: false,
    totalFees: 0,
    examDateBooked: false,
    feesPayment: false,
    speakingDate: false,
    passportNumber: '',
    courseType: '',
    fees: 0,
    discount: 0,
    status: '',
    studentIdNumber: '',
    scoreL: 0,
    scoreR: 0,
    scoreW: 0,
    scoreS: 0,
    scoreO: 0
  };

  // Fee Receipts in Tab 2 matching Image 1
  newReceipt = {
    date: '',
    amount: 0,
    type: '',
    account: '',
    description: ''
  };

  accounts: Account[] = [];
  receiptsList: { id?: string; date: string; amount: number; type: string; account?: string; description: string }[] = [];

  // Dynamic fee calculation getters matching Image 1
  get totalReceiptsAmount(): number {
    return this.receiptsList.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  }

  get balanceFee(): number {
    const totalFees = Number(this.courseData.totalFees) || 0;
    return Math.max(0, totalFees - this.totalReceiptsAmount);
  }

  onFeeCalculationChange() {
    const fees = Number(this.courseData.fees) || 0;
    const book = this.courseData.bookAmountChecked ? (Number(this.courseData.bookAmount) || 0) : 0;
    const discount = Number(this.courseData.discount) || 0;
    this.courseData.totalFees = Math.max(0, fees + book - discount);
  }

  // Tab 3: Follow-up Model
  followupData = {
    status: '',
    toStaff: '',
    comments: '',
    nextDate: ''
  };

  constructor(private route: ActivatedRoute, private router: Router, private mockDataService: DataService, private notify: NotificationService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.mockDataService.getUserRows().subscribe(users => {
      this.staffOptions = users.map(u => u.userName);
    });
    this.mockDataService.getCourseItems().subscribe(c => {
      this.courses = c;
    });
    this.mockDataService.getEnquiryTypes().subscribe(t => {
      this.enquiryTypes = t;
    });
    this.mockDataService.getEnquirySourceItems().subscribe(s => this.enquirySources = s);
    this.mockDataService.getStatusSettingsItems().subscribe(s => this.statuses = s);
    this.mockDataService.getFollowupTypeItems().subscribe(t => this.followupTypes = t);
    this.mockDataService.getAccounts().subscribe(a => { this.accounts = a; this.cdr.markForCheck(); });
    this.route.params.subscribe(params => {
      if (params['name']) {
        this.studentName = decodeURIComponent(params['name']);
        this.details.name = this.studentName;
        this.mockDataService.getStudentByName(this.studentName).subscribe(student => {
          if (!student) return;
          this.studentId = Number(student.id) || null;
          this.studentBranch = student.branch || '';
          this.studentDepartment = student.department || '';
          this.details.name = student.name;
          this.details.mobile = student.phone;
          this.details.email = student.email;
          this.details.date = student.admissionDate;
          this.details.enquiryType = student.enquiryType || '';
          this.details.enquirySource = student.enquirySource || '';
          this.courseData.course = student.course;
          this.courseData.batch = student.batch;
          this.courseData.totalFees = student.feesTotal;
          this.courseData.fees = student.feesTotal;
          this.courseData.status = student.status;
          this.courseData.studentIdNumber = student.code;
          this.mockDataService.getReceipts().subscribe(receipts => {
            this.receiptsList = receipts
              .filter(r =>
                (this.studentId && Number(r.studentId) === this.studentId) ||
                String(r.studentName || r.from || '').toLowerCase() === student.name.toLowerCase()
              )
              .map(r => ({
                id: r.id,
                date: r.date,
                amount: r.amount,
                type: r.paymentMode || 'Fees',
                account: r.toAccount || '',
                description: r.details || ''
              }));
            this.cdr.markForCheck();
          });
          this.mockDataService.getFollowUps().subscribe(items => {
            this.historyList = items
              .filter(f =>
                (this.studentId && Number(f.studentId) === this.studentId) ||
                String(f.studentName || '').toLowerCase() === student.name.toLowerCase()
              )
              .map(f => ({
                nextFollowup: f.nextFollowUpDate || '',
                department: this.studentDepartment || '',
                status: f.status || '',
                to: f.to || f.type || 'admin',
                from: f.from || 'admin',
                isOverdue: false
              }));
            if (this.historyList.length > 0) {
              const latest = this.historyList[0];
              if (!this.followupData.nextDate && latest.nextFollowup) {
                this.followupData.nextDate = latest.nextFollowup;
              }
              if (!this.followupData.status && latest.status) {
                this.followupData.status = latest.status;
              }
            }
            this.cdr.markForCheck();
          });
        });
      }
    });

    this.route.queryParams.subscribe(q => {
      if (q['tab'] && (q['tab'] === 'details' || q['tab'] === 'course' || q['tab'] === 'followup')) {
        this.activeTab = q['tab'];
      } else {
        this.activeTab = 'details';
      }
    });
  }

  setTab(tab: 'details' | 'course' | 'followup') {
    this.activeTab = tab;
  }

  generateId() {
    this.courseData.studentIdNumber = 'STU-' + Math.floor(1000 + Math.random() * 9000);
  }

  addReceiptRow() {
    if (this.newReceipt.amount > 0) {
      const receiptDate = this.newReceipt.date || new Date().toISOString().split('T')[0];
      const amount = Number(this.newReceipt.amount);
      const feeType = this.newReceipt.type && this.newReceipt.type !== 'Select' ? this.newReceipt.type : 'Fees';
      const accountName = this.newReceipt.account && this.newReceipt.account !== 'Select' ? this.newReceipt.account : '';
      const description = this.newReceipt.description || '';

      this.receiptsList = [
        ...this.receiptsList,
        {
          date: receiptDate,
          amount,
          type: feeType,
          account: accountName,
          description
        }
      ];

      this.mockDataService.addReceipt({
        date: receiptDate,
        from: this.details.name || this.studentName,
        studentId: this.studentId ? String(this.studentId) : '',
        studentName: this.details.name || this.studentName,
        course: this.courseData.course || '',
        branch: this.studentBranch,
        amount,
        voucherNo: '',
        details: description,
        toAccount: accountName,
        paymentMode: feeType,
        referenceNo: '',
        remark: description
      });

      this.newReceipt.amount = 0;
      this.newReceipt.type = '';
      this.newReceipt.account = '';
      this.newReceipt.description = '';
      this.cdr.markForCheck();
    }
  }

  isEditReceiptModalOpen = false;
  editingReceiptIndex: number | null = null;
  editingReceiptAmount = 0;

  editReceipt(idx: number) {
    this.editingReceiptIndex = idx;
    this.editingReceiptAmount = this.receiptsList[idx]?.amount || 0;
    this.isEditReceiptModalOpen = true;
  }

  saveEditReceipt() {
    if (this.editingReceiptIndex !== null && !isNaN(Number(this.editingReceiptAmount))) {
      const item: any = this.receiptsList[this.editingReceiptIndex];
      const amount = Number(this.editingReceiptAmount);
      item.amount = amount;
      if (item.id && !isNaN(Number(item.id))) {
        this.mockDataService.updateReceipt(item.id, {
          from: this.details.name || this.studentName,
          studentName: this.details.name || this.studentName,
          course: this.courseData.course || '',
          branch: this.studentBranch,
          date: item.date,
          amount,
          details: item.description || ''
        });
      }
    }
    this.isEditReceiptModalOpen = false;
    this.editingReceiptIndex = null;
  }

  deleteReceipt(idx: number) {
    const item: any = this.receiptsList[idx];
    if (item?.id && !isNaN(Number(item.id))) {
      this.mockDataService.deleteReceipt(item.id);
    }
    this.receiptsList.splice(idx, 1);
  }

  printReceipt(r: any) {
    window.print();
  }

  studentId: number | null = null;
  studentBranch = '';
  studentDepartment = '';

  private fmtDate(d: string | null | undefined): string {
    if (!d) return '';
    const date = new Date(d);
    if (isNaN(date.getTime())) return String(d);
    const day = String(date.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${day}-${months[date.getMonth()]}-${date.getFullYear()}`;
  }

  onSave() {
    if (!this.studentId) return;

    if (this.activeTab === 'followup') {
      const today = new Date().toISOString().slice(0, 10);
      const nextDate = this.followupData.nextDate || '';

      const rawUser = localStorage.getItem('naipunya_user');
      const currentUser = rawUser ? JSON.parse(rawUser).username || 'admin' : 'admin';
      const toStaff = this.followupData.toStaff || 'admin';
      const fromStaff = currentUser;

      this.mockDataService.addFollowUp({
        studentId: String(this.studentId),
        studentName: this.details.name || this.studentName,
        phone: this.details.mobile || '',
        course: this.courseData.course || '',
        date: today,
        type: toStaff,
        to: toStaff,
        from: fromStaff,
        enquirySource: this.details.enquirySource || '',
        remark: this.followupData.comments || '',
        nextFollowUpDate: nextDate,
        status: this.followupData.status || 'Open'
      });

      this.historyList.unshift({
        nextFollowup: nextDate ? this.fmtDate(nextDate) : today,
        department: this.studentDepartment || '',
        status: this.followupData.status || 'Open',
        to: toStaff,
        from: fromStaff,
        isOverdue: false
      });

      this.notify.show(`Follow-up saved successfully for ${this.details.name || this.studentName}`, 'Success', 'primary');
      this.cdr.markForCheck();
      return;
    }

    const totalFees = Number(this.courseData.totalFees) || Number(this.courseData.fees) || 0;
    this.mockDataService.updateStudentDetail(this.studentId, {
      name: this.details.name || this.studentName,
      phone: this.details.mobile || '',
      email: this.details.email || '',
      course: this.courseData.course || '',
      branch: this.studentBranch,
      department: this.studentDepartment,
      feesTotal: totalFees,
      feesPaid: this.totalReceiptsAmount,
      status: this.courseData.status || 'Active'
    }).subscribe({
      next: () => this.notify.show(`Saved changes for ${this.details.name || this.studentName}`, 'Success', 'primary'),
      error: e => {
        console.error('[StudentDetail] save failed:', e);
        this.notify.show('Failed to save student details.', 'Error', 'danger');
      }
    });
  }

  onSaveAndSend() {
    this.onSave();
  }

  onNew() {
    this.router.navigate(['/students/create']);
  }

  isDeleteModalOpen = false;

  onDelete() {
    this.isDeleteModalOpen = true;
  }

  confirmDelete() {
    this.isDeleteModalOpen = false;
    const target = this.studentId || this.studentName;
    if (target) {
      this.mockDataService.deleteStudent(target);
      this.notify.show('Student deleted successfully', 'Success', 'primary');
    }
    this.router.navigate(['/students/list']);
  }

  // Follow-up History Modal State & Data matching reference image
  showHistoryModal = false;

  historyList: { nextFollowup: string; department: string; status: string; to: string; from: string; isOverdue: boolean }[] = [];
  staffOptions: string[] = [];
  courses: CourseItem[] = [];
  enquirySources: EnquirySourceItem[] = [];
  statuses: StatusItem[] = [];
  followupTypes: FollowupTypeItem[] = [];
  enquiryTypes: string[] = ['COURSE', 'RECRUITMENT', 'STUDY'];
  courseTypes: string[] = ['Full Time', 'Part Time'];
  batches: string[] = ['Morning', 'Evening', 'Sunday', 'Saturday'];

  viewHistory() {
    this.showHistoryModal = true;
  }

  closeHistoryModal() {
    this.showHistoryModal = false;
  }

  onClose() {
    this.router.navigate(['/students/list']);
  }
}