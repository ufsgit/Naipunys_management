import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../shared/components/icon.component';
import { DataService, CompanyInfo } from '../../core/data.service';

@Component({
  selector: 'app-company-info',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="company-page-container">
      <!-- Header Row matching Image 2 / Image 10 -->
      <div class="company-header">
        <h1 class="page-title">Company Info</h1>
        <span class="page-subtitle">Organization Profile & Contact Details</span>
      </div>

      <!-- Main Card matching Image 2 / Image 10 -->
      <div class="company-card">
        <div class="card-title">Company Details</div>

        <form (ngSubmit)="saveCompany()">
          <div class="form-grid">
            <!-- Left Column -->
            <div class="col-side">
              <div class="form-row">
                <label class="form-label">Company Name</label>
                <input
                  type="text"
                  class="form-input"
                  name="companyName"
                  [(ngModel)]="company.companyName"
                />
              </div>

              <div class="form-row">
                <label class="form-label">Phone No</label>
                <input
                  type="text"
                  class="form-input"
                  name="phoneNo"
                  [(ngModel)]="company.phoneNo"
                />
              </div>

              <div class="form-row">
                <label class="form-label">Email</label>
                <input
                  type="email"
                  class="form-input"
                  name="email"
                  [(ngModel)]="company.email"
                />
              </div>
            </div>

            <!-- Right Column -->
            <div class="col-side">
              <div class="form-row">
                <label class="form-label">Registered Address</label>
                <input
                  type="text"
                  class="form-input"
                  name="address"
                  [(ngModel)]="company.address"
                />
              </div>

              <div class="form-row">
                <label class="form-label">Land Phone No</label>
                <input
                  type="text"
                  class="form-input"
                  name="landPhone"
                  [(ngModel)]="company.landPhone"
                />
              </div>

              <div class="form-row">
                <label class="form-label">Web Site</label>
                <input
                  type="text"
                  class="form-input"
                  name="website"
                  [(ngModel)]="company.website"
                />
              </div>
            </div>
          </div>

          <!-- Bottom Action Buttons aligned right -->
          <div class="form-actions">
            <button type="submit" class="btn-save">SAVE</button>
            <button type="button" class="btn-cancel" (click)="resetForm()">CANCEL</button>
          </div>
        </form>
      </div>

      <!-- Success Alert Banner if saved -->
      <div class="alert-success" *ngIf="showSavedAlert">
        <app-icon name="check" [size]="16"></app-icon>
        <span>Company details successfully updated!</span>
      </div>
    </div>
  `,
  styles: [`
    .company-page-container {
      padding: 1.75rem 2.25rem;
      background-color: #f8fafc;
      min-height: calc(100vh - 56px);
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    .company-header {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      margin-bottom: 1.25rem;
    }

    .page-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
      letter-spacing: -0.02em;
    }

    .page-subtitle {
      font-size: 0.85rem;
      color: #64748b;
      font-weight: 500;
    }

    /* Main Card */
    .company-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 1.5rem 2rem 1.75rem 2rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
    }

    .card-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 1.75rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      column-gap: 3.5rem;
      row-gap: 1.25rem;
    }

    .col-side {
      display: flex;
      flex-direction: column;
      gap: 1.15rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 140px 1fr;
      align-items: center;
      column-gap: 1rem;
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

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.85rem;
      margin-top: 2rem;
    }

    .btn-save {
      background-color: #16a34a;
      color: #ffffff;
      font-weight: 700;
      font-size: 0.8125rem;
      letter-spacing: 0.05em;
      padding: 0.6rem 2.2rem;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      transition: background-color 0.15s ease;
    }

    .btn-save:hover {
      background-color: #15803d;
    }

    .btn-cancel {
      background-color: #ffffff;
      color: #334155;
      font-weight: 700;
      font-size: 0.8125rem;
      letter-spacing: 0.05em;
      padding: 0.6rem 2rem;
      border-radius: 4px;
      border: 1px solid #cbd5e1;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .btn-cancel:hover {
      background-color: #f8fafc;
      border-color: #94a3b8;
    }

    .alert-success {
      margin-top: 1.25rem;
      background-color: #f0fdf4;
      border: 1px solid #bbf7d0;
      color: #166534;
      padding: 0.75rem 1rem;
      border-radius: 6px;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      font-weight: 500;
    }
  `]
})
export class CompanyInfoComponent implements OnInit {
  company: CompanyInfo = {
    companyName: '',
    phoneNo: '',
    email: '',
    address: '',
    landPhone: '',
    website: ''
  };

  showSavedAlert = false;

  constructor(private mockDataService: DataService) {}

  ngOnInit() {
    this.mockDataService.getCompanyInfo().subscribe(info => {
      this.company = { ...info };
    });
  }

  saveCompany() {
    this.mockDataService.updateCompanyInfo(this.company);
    this.showSavedAlert = true;
    setTimeout(() => {
      this.showSavedAlert = false;
    }, 3500);
  }

  resetForm() {
    this.mockDataService.getCompanyInfo().subscribe(info => {
      this.company = { ...info };
    });
  }
}
