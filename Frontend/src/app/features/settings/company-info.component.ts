import { IconComponent, ModalComponent, ConfirmDialogComponent, PageHeaderComponent, } from '../../shared/index';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService, CompanyInfo } from '../../core/mock-data.service';

@Component({
  selector: 'app-company-info',
  standalone: true,
  imports: [
    PageHeaderComponent,
    CommonModule,
    FormsModule,
    IconComponent
  ],
  template: `
    <app-page-header
      title="Company Information"
      icon="info"
      [breadcrumbs]="[{ label: 'Settings' }, { label: 'Company Info' }]"
    ></app-page-header>

    <div class="card">
      <div class="card-header">
        <div class="card-title">
          <app-icon name="building" [size]="18" customClass="text-primary"></app-icon>
          <span>Institute Master Profile & Institutional Details</span>
        </div>
        <span class="badge badge-success">Verified Entity</span>
      </div>

      <div class="card-body">
        <div *ngIf="showSuccess" class="alert alert-success">
          <app-icon name="check" [size]="18"></app-icon>
          <span>Institutional company settings updated successfully!</span>
        </div>

        <form (ngSubmit)="saveCompany()" #compForm="ngForm">
          <div class="form-grid-3">
            <div class="form-group full-width">
              <label class="form-label required">Institution / Company Name</label>
              <input type="text" class="form-control" name="name" [(ngModel)]="info.name" required />
            </div>

            <div class="form-group full-width">
              <label class="form-label required">Tagline / Motto</label>
              <input type="text" class="form-control" name="tagline" [(ngModel)]="info.tagline" required />
            </div>

            <div class="form-group">
              <label class="form-label required">Government Registration No</label>
              <input type="text" class="form-control" name="regNo" [(ngModel)]="info.registrationNo" required />
            </div>

            <div class="form-group">
              <label class="form-label required">Tax / GST Number</label>
              <input type="text" class="form-control" name="taxId" [(ngModel)]="info.taxId" required />
            </div>

            <div class="form-group">
              <label class="form-label required">Base Currency</label>
              <input type="text" class="form-control" name="currency" [(ngModel)]="info.currency" required />
            </div>

            <div class="form-group">
              <label class="form-label required">Primary Contact Phone</label>
              <input type="text" class="form-control" name="phone" [(ngModel)]="info.phone" required />
            </div>

            <div class="form-group">
              <label class="form-label required">Official Email Address</label>
              <input type="email" class="form-control" name="email" [(ngModel)]="info.email" required />
            </div>

            <div class="form-group">
              <label class="form-label required">Official Website URL</label>
              <input type="url" class="form-control" name="website" [(ngModel)]="info.website" required />
            </div>

            <div class="form-group full-width">
              <label class="form-label required">Campus Head Office Address</label>
              <textarea class="form-textarea" name="address" [(ngModel)]="info.address" required rows="2"></textarea>
            </div>

            <div class="form-group">
              <label class="form-label required">City</label>
              <input type="text" class="form-control" name="city" [(ngModel)]="info.city" required />
            </div>

            <div class="form-group">
              <label class="form-label required">State</label>
              <input type="text" class="form-control" name="state" [(ngModel)]="info.state" required />
            </div>

            <div class="form-group">
              <label class="form-label required">Postal Pincode</label>
              <input type="text" class="form-control" name="pincode" [(ngModel)]="info.pincode" required />
            </div>
          </div>

          <div style="margin-top: 1.5rem; display: flex; gap: 0.75rem;">
            <button type="submit" class="btn btn-primary" [disabled]="!compForm.form.valid">
              <app-icon name="check" [size]="16"></app-icon>
              <span>Save & Update Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class CompanyInfoComponent implements OnInit {
  showSuccess = false;
  info: CompanyInfo = {
    name: '',
    tagline: '',
    registrationNo: '',
    taxId: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    currency: 'INR (₹)'
  };

  constructor(private mockDataService: MockDataService) {}

  ngOnInit() {
    this.mockDataService.getCompanyInfo().subscribe(c => {
      this.info = { ...c };
    });
  }

  saveCompany() {
    this.mockDataService.updateCompanyInfo(this.info);
    this.showSuccess = true;
    setTimeout(() => {
      this.showSuccess = false;
    }, 2500);
  }
}
