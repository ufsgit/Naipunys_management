import { ModalComponent, ConfirmDialogComponent, PageHeaderComponent, PaginationComponent, FilterBarComponent } from '../../shared/index';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DataService, Branch, DepartmentItem, UserRow, EnquirySourceItem, StatusItem, FollowupTypeItem } from '../../core/data.service';
import { NotificationService } from '../../core/notification.service';

@Component({
  selector: 'app-student-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  template: `
    <div class="create-student-page">
      <h1 class="page-title">Create New Student</h1>

      <!-- Section 1: Student Details -->
      <div class="panel-box">
        <div class="panel-header">
          <span class="panel-title">Student Details</span>
        </div>
        <div class="panel-body">
          <div class="form-columns-2">
            <!-- Left Column -->
            <div class="column-group">
              <div class="field-row">
                <label class="field-label required">Enquiry Source</label>
                <div class="field-control">
                  <select class="input-select" [(ngModel)]="student.enquirySource">
                    <option *ngFor="let s of enquirySources" [value]="s.name">{{ s.name }}</option>
                  </select>
                </div>
              </div>

              <div class="field-row">
                <label class="field-label required">Enquiry Type</label>
                <div class="field-control">
                  <select class="input-select" [(ngModel)]="student.enquiryType">
                    <option value="">Select</option>
                    <option *ngFor="let t of enquiryTypes" [value]="t">{{ t }}</option>
                  </select>
                </div>
              </div>

              <div class="field-row">
                <label class="field-label required">Name</label>
                <div class="field-control">
                  <input
                    type="text"
                    class="input-text"
                    placeholder="Enter student name"
                    [(ngModel)]="student.name"
                  />
                </div>
              </div>

              <div class="field-row">
                <label class="field-label required">Mobile</label>
                <div class="field-control">
                  <input
                    type="text"
                    class="input-text"
                    placeholder="98470 00000"
                    [(ngModel)]="student.mobile"
                  />
                </div>
              </div>

              <div class="field-row">
                <label class="field-label required">Parents Mobile</label>
                <div class="field-control">
                  <input
                    type="text"
                    class="input-text"
                    placeholder="94460 00000"
                    [(ngModel)]="student.parentsMobile"
                  />
                </div>
              </div>

              <div class="field-row">
                <label class="field-label">Note</label>
                <div class="field-control">
                  <input
                    type="text"
                    class="input-text"
                    placeholder="Course interest or enquiry note"
                    [(ngModel)]="student.note"
                  />
                </div>
              </div>
            </div>

            <!-- Right Column -->
            <div class="column-group">
              <div class="field-row">
                <label class="field-label">Facebook</label>
                <div class="field-control">
                  <input
                    type="text"
                    class="input-text"
                    placeholder="Profile handle or campaign ID"
                    [(ngModel)]="student.facebook"
                  />
                </div>
              </div>

              <div class="field-row align-start">
                <label class="field-label">Address</label>
                <div class="field-control">
                  <textarea
                    rows="2"
                    class="input-textarea"
                    placeholder="House name, street, city, and PIN code"
                    [(ngModel)]="student.address"
                  ></textarea>
                </div>
              </div>

              <div class="field-row">
                <label class="field-label">Email</label>
                <div class="field-control">
                  <input
                    type="email"
                    class="input-text"
                    placeholder="student@example.com"
                    [(ngModel)]="student.email"
                  />
                </div>
              </div>

              <div class="field-row">
                <label class="field-label">Alternative Email</label>
                <div class="field-control">
                  <input
                    type="email"
                    class="input-text"
                    placeholder="parent@example.com"
                    [(ngModel)]="student.altEmail"
                  />
                </div>
              </div>

              <div class="field-row">
                <label class="field-label">Date</label>
                <div class="field-control">
                  <input
                    type="date"
                    class="input-text"
                    [(ngModel)]="student.date"
                  />
                </div>
              </div>

              <div class="field-row">
                <label class="field-label">WhatsApp</label>
                <div class="field-control">
                  <input
                    type="text"
                    class="input-text"
                    placeholder="Same as mobile number"
                    [(ngModel)]="student.whatsapp"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 2: First Call -->
      <div class="panel-box">
        <div class="panel-header">
          <span class="panel-title">First Call</span>
        </div>
        <div class="panel-body">
          <div class="first-call-grid">
            <!-- Row 1 -->
            <div class="first-call-field">
              <label class="field-label required">Branch</label>
              <div class="field-control">
                <select class="input-select" [(ngModel)]="student.branch">
                  <option *ngFor="let b of branches" [value]="b.name">{{ b.name }}</option>
                </select>
              </div>
            </div>

            <div class="first-call-field">
              <label class="field-label required">Department</label>
              <div class="field-control">
                <select class="input-select" [(ngModel)]="student.department">
                  <option *ngFor="let d of departments" [value]="d.name">{{ d.name }}</option>
                </select>
              </div>
            </div>

            <div class="first-call-field">
              <label class="field-label required">To</label>
              <div class="field-control">
                <select class="input-select" [(ngModel)]="student.assignedTo">
                  <option *ngFor="let u of staffOptions" [value]="u.userName">{{ u.userName }}</option>
                </select>
              </div>
            </div>

            <!-- Row 2 -->
            <div class="first-call-field">
              <label class="field-label required">Status</label>
              <div class="field-control">
                <select class="input-select" [(ngModel)]="student.status">
                  <option *ngFor="let s of statuses" [value]="s.name">{{ s.name }}</option>
                </select>
              </div>
            </div>

            <div class="first-call-field">
              <label class="field-label required">Followup Type</label>
              <div class="field-control">
                <select class="input-select" [(ngModel)]="student.followupType">
                  <option *ngFor="let t of followupTypes" [value]="t.name">{{ t.name }}</option>
                </select>
              </div>
            </div>

            <div class="first-call-field">
              <label class="field-label required">Next Follow up Date</label>
              <div class="field-control">
                <input
                  type="date"
                  class="input-text"
                  [(ngModel)]="student.nextFollowupDate"
                />
              </div>
            </div>

            <!-- Row 3: Course Type & Batch -->
            <div class="first-call-field">
              <label class="field-label">Course Type</label>
              <div class="field-control">
                <select class="input-select" [(ngModel)]="student.courseType">
                  <option value="">Select</option>
                  <option *ngFor="let ct of courseTypes" [value]="ct">{{ ct }}</option>
                </select>
              </div>
            </div>

            <div class="first-call-field">
              <label class="field-label">Batch</label>
              <div class="field-control">
                <select class="input-select" [(ngModel)]="student.batch">
                  <option value="">Select</option>
                  <option *ngFor="let b of batches" [value]="b">{{ b }}</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Remarks Row -->
          <div class="remarks-row">
            <label class="field-label">Remarks</label>
            <div class="field-control">
              <input
                type="text"
                class="input-text"
                placeholder="Follow-up remarks or call notes"
                [(ngModel)]="student.remarks"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="action-footer">
        <button type="button" class="btn-action btn-new" (click)="resetForm()">NEW</button>
        <button type="button" class="btn-action btn-save" (click)="saveStudent(false)">SAVE</button>
        <button type="button" class="btn-action btn-save-send" (click)="saveStudent(true)">SAVE & SEND</button>
      </div>

      <div *ngIf="showSuccess" class="success-banner">
        Student saved successfully!
      </div>
    </div>
  `,
  styles: [`
    .create-student-page {
      padding: 1.25rem 2rem 2.5rem 2rem;
      background-color: #f6f8fb;
      min-height: calc(100vh - 60px);
      font-family: inherit;
    }

    .page-title {
      font-size: 1.55rem;
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
      margin-bottom: 1.25rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
      overflow: hidden;
    }

    .panel-header {
      padding: 0.85rem 1.25rem;
      border-bottom: 1px solid #edf2f7;
    }

    .panel-title {
      font-size: 0.95rem;
      font-weight: 600;
      color: #1e293b;
    }

    .panel-body {
      padding: 1.25rem 1.75rem 1.5rem 1.75rem;
    }

    /* 2 Columns Layout for Student Details */
    .form-columns-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      column-gap: 3.5rem;
    }

    .column-group {
      display: flex;
      flex-direction: column;
      gap: 0.95rem;
    }

    /* Form Rows */
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

    /* Input controls */
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
      transition: border-color 0.15s, box-shadow 0.15s;
      outline: none;
      box-sizing: border-box;
    }

    .input-textarea {
      height: auto;
      min-height: 52px;
      resize: vertical;
      line-height: 1.4;
      font-family: inherit;
    }

    .input-text::placeholder,
    .input-textarea::placeholder {
      color: #94a3b8;
      font-size: 0.82rem;
    }

    .input-text:focus,
    .input-select:focus,
    .input-textarea:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
    }

    .input-select {
      appearance: none;
      -webkit-appearance: none;
      background-image: url("data:image/svg2+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 0.75rem center;
      background-size: 1rem;
      padding-right: 2rem;
      cursor: pointer;
    }

    /* Section 2: First Call */
    .first-call-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      row-gap: 1.1rem;
      column-gap: 2.5rem;
      margin-bottom: 1.1rem;
    }

    .first-call-field {
      display: grid;
      grid-template-columns: 140px 1fr;
      align-items: center;
      gap: 0.85rem;
    }

    .remarks-row {
      display: grid;
      grid-template-columns: 140px 1fr;
      align-items: center;
      gap: 0.85rem;
    }

    /* Action Footer */
    .action-footer {
      background: #ffffff;
      border: 1px solid #e5e9f2;
      border-radius: 8px;
      padding: 0.9rem 1.5rem;
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
      transition: background-color 0.15s, opacity 0.15s;
    }

    .btn-new {
      background-color: #ffffff;
      border: 1px solid #cbd5e1;
      color: #334155;
    }

    .btn-new:hover {
      background-color: #f1f5f9;
    }

    .btn-save {
      background-color: #15803d;
      color: #ffffff;
    }

    .btn-save:hover {
      background-color: #166534;
    }

    .btn-save-send {
      background-color: #1d4ed8;
      color: #ffffff;
    }

    .btn-save-send:hover {
      background-color: #1e40af;
    }

    .success-banner {
      margin-top: 1rem;
      padding: 0.75rem 1rem;
      background-color: #dcfce7;
      color: #15803d;
      border: 1px solid #86efac;
      border-radius: 6px;
      font-size: 0.88rem;
      font-weight: 500;
      text-align: center;
    }

    @media (max-width: 1024px) {
      .form-columns-2 {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      .first-call-grid {
        grid-template-columns: 1fr;
      }
      .field-row,
      .first-call-field,
      .remarks-row {
        grid-template-columns: 130px 1fr;
      }
    }
  `]
})
export class StudentCreateComponent implements OnInit {
  showSuccess = false;

  branches: Branch[] = [];
  departments: DepartmentItem[] = [];
  staffOptions: UserRow[] = [];
  enquirySources: EnquirySourceItem[] = [];
  statuses: StatusItem[] = [];
  followupTypes: FollowupTypeItem[] = [];
  enquiryTypes: string[] = ['COURSE', 'RECRUITMENT', 'STUDY'];
  courseTypes: string[] = ['Full Time', 'Part Time'];
  batches: string[] = ['Morning', 'Evening', 'Sunday', 'Saturday'];

  student = {
    enquirySource: '',
    enquiryType: '',
    courseType: '',
    name: '',
    mobile: '',
    parentsMobile: '',
    note: '',
    facebook: '',
    address: '',
    email: '',
    altEmail: '',
    date: '',
    whatsapp: '',
    branch: '',
    department: '',
    assignedTo: '',
    batch: '',
    status: '',
    followupType: '',
    nextFollowupDate: '',
    remarks: ''
  };

  constructor(private router: Router, private mockDataService: DataService, private notify: NotificationService) {}

  ngOnInit() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const formatted = `${yyyy}-${mm}-${dd}`;
    this.student.date = formatted;
    this.student.nextFollowupDate = formatted;

    this.mockDataService.getBranches().subscribe(b => this.branches = b);
    this.mockDataService.getDepartmentItems().subscribe(d => this.departments = d);
    this.mockDataService.getUserRows().subscribe(u => this.staffOptions = u);
    this.mockDataService.getEnquirySourceItems().subscribe(s => this.enquirySources = s);
    this.mockDataService.getStatusSettingsItems().subscribe(s => this.statuses = s);
    this.mockDataService.getFollowupTypeItems().subscribe(t => this.followupTypes = t);
    this.mockDataService.getEnquiryTypes().subscribe(t => {
      this.enquiryTypes = t;
    });
  }

  resetForm() {
    this.student.name = '';
    this.student.mobile = '';
    this.student.parentsMobile = '';
    this.student.note = '';
    this.student.facebook = '';
    this.student.address = '';
    this.student.email = '';
    this.student.altEmail = '';
    this.student.whatsapp = '';
    this.student.remarks = '';
    this.student.enquiryType = '';
    this.student.enquirySource = '';
    this.showSuccess = false;
  }

  saveStudent(andSend = false) {
    if (!this.student.name) {
      this.notify.show('Please enter student name', 'Validation', 'warning');
      return;
    }

    this.mockDataService.addStudent({
      name: this.student.name,
      course: this.student.department,
      branch: this.student.branch,
      department: this.student.department,
      batch: this.student.batch || '',
      admissionDate: this.student.date,
      feesTotal: 0,
      feesPaid: 0,
      status: 'Active',
      phone: this.student.mobile,
      email: this.student.email,
      enquiryType: this.student.enquiryType,
      enquirySource: this.student.enquirySource,
      parentsMobile: this.student.parentsMobile,
      whatsapp: this.student.whatsapp,
      address: this.student.address,
      facebook: this.student.facebook,
      altEmail: this.student.altEmail
    });

    this.showSuccess = true;
    setTimeout(() => {
      this.showSuccess = false;
      this.router.navigate(['/students/list']);
    }, 1200);
  }
}
