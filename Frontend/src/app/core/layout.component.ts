import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { IconComponent } from '../shared/index';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, IconComponent],
  template: `
    <div class="app-shell">
      <!-- Top Navigation Bar matching reference -->
      <header class="topbar-navbar">
        <!-- Left: Logo & Navigation Items -->
        <div class="topbar-left-zone">
          <!-- Brand Logo: Blue Graduation Cap + Naipunya text -->
          <a routerLink="/dashboard" class="brand-link">
            <app-icon name="graduation-cap" [size]="21" customClass="text-brand-blue"></app-icon>
            <span class="brand-name">Naipunya</span>
          </a>

          <!-- Navigation Menu -->
          <nav class="top-nav-menu">
            <!-- Create New (Primary blue pill button) -->
            <a routerLink="/students/create" routerLinkActive="active" class="top-nav-btn-pill">
              <app-icon name="user-plus" [size]="14"></app-icon>
              <span>Create New</span>
            </a>

            <!-- Student List -->
            <a routerLink="/students/list" routerLinkActive="active" class="top-menu-link">
              <app-icon name="users" [size]="14"></app-icon>
              <span>Student List</span>
            </a>

            <!-- Accounts Dropdown with Rich Colored Contents -->
            <div class="nav-dropdown" [class.open]="activeDropdown === 'accounts'">
              <button type="button" class="top-menu-dropdown-btn" (click)="toggleDropdown('accounts', $event)">
                <app-icon name="credit-card" [size]="14"></app-icon>
                <span>Accounts</span>
                <app-icon name="chevron-down" [size]="12" customClass="dropdown-arrow"></app-icon>
              </button>
              <div class="accounts-dropdown-panel" *ngIf="activeDropdown === 'accounts'" (click)="$event.stopPropagation()">
                <div class="accounts-menu-header">
                  <div class="accounts-header-icon">
                    <app-icon name="credit-card" [size]="17"></app-icon>
                  </div>
                  <div class="header-text-group">
                    <h4 class="accounts-header-title">Accounts & Financials</h4>
                  </div>
                </div>

                <div class="accounts-menu-body">
                  <div class="category-capsule capsule-teal">TRANSACTIONS & RECEIPTS</div>
                  <div class="mega-items-list">
                    <a routerLink="/accounts" class="mega-item item-hover-teal" (click)="closeDropdowns()">
                      <div class="item-icon-badge badge-teal">
                        <app-icon name="credit-card" [size]="16"></app-icon>
                      </div>
                      <span class="item-label">Accounts Management</span>
                    </a>

                    <a routerLink="/receipts" class="mega-item item-hover-amber" (click)="closeDropdowns()">
                      <div class="item-icon-badge badge-amber">
                        <app-icon name="receipt" [size]="16"></app-icon>
                      </div>
                      <span class="item-label">Receipt Management</span>
                    </a>

                    <a routerLink="/accounts/create" class="mega-item item-hover-green" (click)="closeDropdowns()">
                      <div class="item-icon-badge badge-green">
                        <app-icon name="plus" [size]="16"></app-icon>
                      </div>
                      <span class="item-label">Create New Account</span>
                    </a>

                    <a routerLink="/reports/fee-receipt" class="mega-item item-hover-blue" (click)="closeDropdowns()">
                      <div class="item-icon-badge badge-blue">
                        <app-icon name="dollar-sign" [size]="16"></app-icon>
                      </div>
                      <span class="item-label">Fee Collection Log</span>
                    </a>

                    <a routerLink="/reports/fee-pending" class="mega-item item-hover-rose" (click)="closeDropdowns()">
                      <div class="item-icon-badge badge-rose">
                        <app-icon name="clock" [size]="16"></app-icon>
                      </div>
                      <span class="item-label">Outstanding Fees Report</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <!-- Report Dropdown (Mega Menu matching reference image with vibrant colored contents) -->
            <div class="nav-dropdown mega-nav-dropdown" [class.open]="activeDropdown === 'reports'">
              <button type="button" class="top-menu-dropdown-btn" (click)="toggleDropdown('reports', $event)">
                <app-icon name="pie-chart" [size]="14"></app-icon>
                <span>Report</span>
                <app-icon name="chevron-down" [size]="12" customClass="dropdown-arrow"></app-icon>
              </button>

              <div class="mega-menu-panel" *ngIf="activeDropdown === 'reports'" (click)="$event.stopPropagation()">
                <!-- Top Header Bar -->
                <div class="mega-menu-header">
                  <div class="header-icon-box">
                    <app-icon name="sliders" [size]="18"></app-icon>
                  </div>
                  <div class="header-text-group">
                    <h3 class="header-title">Reports & System Analytics</h3>
                  </div>
                </div>

                <!-- 4 Categorized Columns -->
                <div class="mega-menu-grid">
                  <!-- Column 1: Financial & Fees -->
                  <div class="mega-column">
                    <div class="category-capsule capsule-blue">FEES & REVENUE</div>
                    <div class="mega-items-list">
                      <a routerLink="/reports/fee-receipt" class="mega-item item-hover-green" (click)="closeDropdowns()">
                        <div class="item-icon-badge badge-green">
                          <app-icon name="receipt" [size]="16"></app-icon>
                        </div>
                        <span class="item-label">Fees Receipt Report</span>
                      </a>

                      <a routerLink="/reports/fee-pending" class="mega-item item-hover-rose" (click)="closeDropdowns()">
                        <div class="item-icon-badge badge-rose">
                          <app-icon name="clock" [size]="16"></app-icon>
                        </div>
                        <span class="item-label">Fees Pending Report</span>
                      </a>

                      <a routerLink="/reports/fee-receipt" class="mega-item item-hover-sky" (click)="closeDropdowns()">
                        <div class="item-icon-badge badge-sky">
                          <app-icon name="credit-card" [size]="16"></app-icon>
                        </div>
                        <span class="item-label">Branch Account Statement</span>
                      </a>

                      <a routerLink="/reports/fee-receipt" class="mega-item item-hover-amber" (click)="closeDropdowns()">
                        <div class="item-icon-badge badge-amber">
                          <app-icon name="dollar-sign" [size]="16"></app-icon>
                        </div>
                        <span class="item-label">Daily Collection Log</span>
                      </a>

                      <a routerLink="/reports/fee-receipt" class="mega-item item-hover-lime" (click)="closeDropdowns()">
                        <div class="item-icon-badge badge-lime">
                          <app-icon name="file-text" [size]="16"></app-icon>
                        </div>
                        <span class="item-label">Receipt Type Analysis</span>
                      </a>
                    </div>
                  </div>

                  <!-- Column 2: Academics & Admissions -->
                  <div class="mega-column">
                    <div class="category-capsule capsule-purple">ACADEMICS & STUDENTS</div>
                    <div class="mega-items-list">
                      <a routerLink="/students/list" class="mega-item item-hover-indigo" (click)="closeDropdowns()">
                        <div class="item-icon-badge badge-indigo">
                          <app-icon name="users" [size]="16"></app-icon>
                        </div>
                        <span class="item-label">Student Enrollment Report</span>
                      </a>

                      <a routerLink="/setup/courses" class="mega-item item-hover-orange" (click)="closeDropdowns()">
                        <div class="item-icon-badge badge-orange">
                          <app-icon name="book-open" [size]="16"></app-icon>
                        </div>
                        <span class="item-label">Course Wise Admissions</span>
                      </a>

                      <a routerLink="/students/list" class="mega-item item-hover-purple" (click)="closeDropdowns()">
                        <div class="item-icon-badge badge-purple">
                          <app-icon name="graduation-cap" [size]="16"></app-icon>
                        </div>
                        <span class="item-label">Application Status</span>
                      </a>

                      <a routerLink="/students/list" class="mega-item item-hover-cyan" (click)="closeDropdowns()">
                        <div class="item-icon-badge badge-cyan">
                          <app-icon name="calendar" [size]="16"></app-icon>
                        </div>
                        <span class="item-label">Intake & Batch Overview</span>
                      </a>

                      <a routerLink="/students/list" class="mega-item item-hover-blue" (click)="closeDropdowns()">
                        <div class="item-icon-badge badge-blue">
                          <app-icon name="award" [size]="16"></app-icon>
                        </div>
                        <span class="item-label">Academic Year Audit</span>
                      </a>
                    </div>
                  </div>

                  <!-- Column 3: Leads & Pipeline -->
                  <div class="mega-column">
                    <div class="category-capsule capsule-green">LEADS & PIPELINE</div>
                    <div class="mega-items-list">
                      <a routerLink="/students/follow-up" class="mega-item item-hover-teal" (click)="closeDropdowns()">
                        <div class="item-icon-badge badge-teal">
                          <app-icon name="activity" [size]="16"></app-icon>
                        </div>
                        <span class="item-label">Lead Status Overview</span>
                      </a>

                      <a routerLink="/students/follow-up" class="mega-item item-hover-pink" (click)="closeDropdowns()">
                        <div class="item-icon-badge badge-pink">
                          <app-icon name="help-circle" [size]="16"></app-icon>
                        </div>
                        <span class="item-label">Enquiry Source Report</span>
                      </a>

                      <a routerLink="/students/follow-up" class="mega-item item-hover-violet" (click)="closeDropdowns()">
                        <div class="item-icon-badge badge-violet">
                          <app-icon name="list" [size]="16"></app-icon>
                        </div>
                        <span class="item-label">Follow-up Call Register</span>
                      </a>

                      <a routerLink="/settings/enquiry-sources" class="mega-item item-hover-yellow" (click)="closeDropdowns()">
                        <div class="item-icon-badge badge-yellow">
                          <app-icon name="folder" [size]="16"></app-icon>
                        </div>
                        <span class="item-label">Field Categories</span>
                      </a>

                      <a routerLink="/reports/fee-receipt" class="mega-item item-hover-emerald" (click)="closeDropdowns()">
                        <div class="item-icon-badge badge-emerald">
                          <app-icon name="check" [size]="16"></app-icon>
                        </div>
                        <span class="item-label">Conversion Performance</span>
                      </a>
                    </div>
                  </div>

                  <!-- Column 4: Staff & Operations -->
                  <div class="mega-column">
                    <div class="category-capsule capsule-teal">STAFF & OPERATIONS</div>
                    <div class="mega-items-list">
                      <a routerLink="/reports/fee-pending" class="mega-item item-hover-emerald" (click)="closeDropdowns()">
                        <div class="item-icon-badge badge-emerald">
                          <app-icon name="briefcase" [size]="16"></app-icon>
                        </div>
                        <span class="item-label">Staff Work Report</span>
                      </a>

                      <a routerLink="/setup/users/list" class="mega-item item-hover-sky" (click)="closeDropdowns()">
                        <div class="item-icon-badge badge-sky">
                          <app-icon name="user-check" [size]="16"></app-icon>
                        </div>
                        <span class="item-label">User Activity Audit</span>
                      </a>

                      <a routerLink="/departments/list" class="mega-item item-hover-coral" (click)="closeDropdowns()">
                        <div class="item-icon-badge badge-coral">
                          <app-icon name="git-branch" [size]="16"></app-icon>
                        </div>
                        <span class="item-label">Department Summary</span>
                      </a>

                      <a routerLink="/branches/list" class="mega-item item-hover-mint" (click)="closeDropdowns()">
                        <div class="item-icon-badge badge-mint">
                          <app-icon name="building" [size]="16"></app-icon>
                        </div>
                        <span class="item-label">Branch Performance</span>
                      </a>

                      <a routerLink="/reports/fee-receipt" class="mega-item item-hover-softgreen" (click)="closeDropdowns()">
                        <div class="item-icon-badge badge-softgreen">
                          <app-icon name="file-spreadsheet" [size]="16"></app-icon>
                        </div>
                        <span class="item-label">Excel Export & Audit</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Settings Dropdown -->
            <div class="nav-dropdown" [class.open]="activeDropdown === 'settings'">
              <button type="button" class="top-menu-dropdown-btn" (click)="toggleDropdown('settings', $event)">
                <app-icon name="settings" [size]="14"></app-icon>
                <span>Settings</span>
                <app-icon name="chevron-down" [size]="12" customClass="dropdown-arrow"></app-icon>
              </button>
              <div class="dropdown-flyout" *ngIf="activeDropdown === 'settings'">
                <div class="flyout-header">COURSE & USERS</div>
                <a routerLink="/setup/courses" class="flyout-item" (click)="closeDropdowns()">Course Setup</a>
                <a routerLink="/setup/roles" class="flyout-item" (click)="closeDropdowns()">User Roles</a>
                <a routerLink="/setup/users/list" class="flyout-item" (click)="closeDropdowns()">User Details</a>
                <div class="flyout-header">BASIC SETTINGS</div>
                <a routerLink="/settings/followup-types" class="flyout-item" (click)="closeDropdowns()">Follow-up Types</a>
                <a routerLink="/settings/enquiry-sources" class="flyout-item" (click)="closeDropdowns()">Enquiry Sources</a>
                <a routerLink="/settings/status-list" class="flyout-item" (click)="closeDropdowns()">Status Settings</a>
                <div class="flyout-header">ORGANIZATION</div>
                <a routerLink="/departments/list" class="flyout-item" (click)="closeDropdowns()">Department Management</a>
                <a routerLink="/branches/list" class="flyout-item" (click)="closeDropdowns()">Branch Management</a>
                <a routerLink="/company-info" class="flyout-item" (click)="closeDropdowns()">Company Information</a>
              </div>
            </div>
          </nav>
        </div>

        <!-- Right: User Avatar & Logout -->
        <div class="topbar-right-zone">
          <div class="director-user-info">
            <app-icon name="user" [size]="15" customClass="user-icon"></app-icon>
            <span class="director-title">DIRECTOR</span>
          </div>

          <button type="button" class="logout-action-btn" (click)="onLogout()" title="Logout">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
              <line x1="12" y1="2" x2="12" y2="12"></line>
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </header>

      <!-- Main Content Viewport -->
      <main class="content-viewport">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-shell {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      width: 100%;
      background-color: #f8fafc;
    }

    /* Topbar Navbar matching reference */
    .topbar-navbar {
      height: 52px;
      background-color: #ffffff;
      border-bottom: 1px solid #e5e9f0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.5rem;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
    }

    .topbar-left-zone {
      display: flex;
      align-items: center;
      gap: 1.75rem;
    }

    /* Brand Logo */
    .brand-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      user-select: none;
    }
    .text-brand-blue {
      color: #2563eb;
    }
    .brand-name {
      font-size: 1.05rem;
      font-weight: 600;
      color: #1e293b;
      letter-spacing: -0.01em;
    }

    /* Navigation Menu */
    .top-nav-menu {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    /* Primary Active "Create New" Blue Pill Button */
    .top-nav-btn-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.42rem 0.95rem;
      font-size: 0.8125rem;
      font-weight: 500;
      color: #ffffff;
      background-color: #1d4ed8;
      border-radius: 6px;
      text-decoration: none;
      transition: background-color 0.15s ease;
    }
    .top-nav-btn-pill:hover {
      background-color: #1e40af;
    }

    /* Normal top nav link */
    .top-menu-link,
    .top-menu-dropdown-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.35rem 0.5rem;
      font-size: 0.8125rem;
      font-weight: 500;
      color: #334155;
      text-decoration: none;
      border-radius: 4px;
      background: transparent;
      border: none;
      cursor: pointer;
      transition: color 0.15s ease;
      font-family: inherit;
    }
    .top-menu-link:hover,
    .top-menu-dropdown-btn:hover {
      color: #1d4ed8;
    }
    .top-menu-link.active {
      color: #1d4ed8;
      font-weight: 600;
    }

    /* Dropdowns */
    .nav-dropdown {
      position: relative;
    }
    .dropdown-arrow {
      color: #64748b;
      margin-left: 2px;
      transition: transform 0.2s ease;
    }
    .nav-dropdown.open .dropdown-arrow {
      transform: rotate(180deg);
    }
    .dropdown-flyout {
      position: absolute;
      top: calc(100% + 6px);
      left: 0;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04);
      min-width: 210px;
      padding: 0.4rem 0;
      z-index: 200;
    }
    .flyout-header {
      font-size: 0.65rem;
      font-weight: 700;
      color: #94a3b8;
      letter-spacing: 0.08em;
      padding: 0.4rem 0.9rem 0.2rem;
    }
    .flyout-item {
      display: block;
      padding: 0.45rem 0.9rem;
      font-size: 0.8rem;
      color: #334155;
      text-decoration: none;
      transition: background 0.1s ease;
    }
    .flyout-item:hover {
      background-color: #f8fafc;
      color: #1d4ed8;
    }

    /* Mega Menu Dropdown matching reference image */
    .mega-nav-dropdown {
      position: relative;
    }

    .mega-menu-panel {
      position: absolute;
      top: calc(100% + 8px);
      left: -240px;
      width: 960px;
      max-width: 92vw;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      box-shadow: 0 20px 45px -10px rgba(15, 23, 42, 0.15), 0 4px 12px rgba(0, 0, 0, 0.04);
      z-index: 300;
      overflow: hidden;
      animation: fadeInMega 0.15s ease-out;
    }

    @keyframes fadeInMega {
      from {
        opacity: 0;
        transform: translateY(-6px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .mega-menu-header {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 1.1rem 1.6rem;
      border-bottom: 1px solid #f1f5f9;
      background: #ffffff;
    }

    .header-icon-box {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 10px rgba(99, 102, 241, 0.25);
    }

    .header-title {
      font-size: 1.05rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
      letter-spacing: -0.01em;
    }

    .mega-menu-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
      padding: 1.4rem 1.6rem 1.6rem;
      background: #ffffff;
    }

    .mega-column {
      display: flex;
      flex-direction: column;
    }

    .category-capsule {
      display: inline-block;
      align-self: flex-start;
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      padding: 0.3rem 0.75rem;
      border-radius: 9999px;
      margin-bottom: 1.1rem;
    }

    .capsule-blue { background-color: #eff6ff; color: #2563eb; }
    .capsule-purple { background-color: #faf5ff; color: #7c3aed; }
    .capsule-green { background-color: #f0fdf4; color: #16a34a; }
    .capsule-teal { background-color: #f0fdfa; color: #0d9488; }

    .mega-items-list {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .mega-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.45rem 0.55rem;
      border-radius: 8px;
      text-decoration: none;
      transition: all 0.15s ease;
    }

    .mega-item:hover {
      background-color: #f8fafc;
      transform: translateX(2px);
    }

    .item-icon-badge {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .item-label {
      font-size: 0.8125rem;
      font-weight: 500;
      color: #334155;
      line-height: 1.25;
      transition: color 0.15s ease;
    }

    .mega-item:hover .item-label {
      color: #0f172a;
      font-weight: 600;
    }

    /* Accounts Dropdown Panel matching theme */
    .accounts-dropdown-panel {
      position: absolute;
      top: calc(100% + 8px);
      left: 0;
      width: 320px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.15), 0 4px 12px rgba(0, 0, 0, 0.04);
      z-index: 300;
      overflow: hidden;
      animation: fadeInMega 0.15s ease-out;
    }

    .accounts-menu-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.95rem 1.25rem;
      border-bottom: 1px solid #f1f5f9;
      background: #ffffff;
    }

    .accounts-header-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: linear-gradient(135deg, #059669, #10b981);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 10px rgba(16, 185, 129, 0.25);
    }

    .accounts-header-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
      letter-spacing: -0.01em;
    }

    .accounts-menu-body {
      padding: 1.1rem 1.25rem 1.25rem;
      background: #ffffff;
    }

    /* Vibrant Colored Item Hover States */
    .item-hover-green:hover { background-color: #f0fdf4; }
    .item-hover-green:hover .item-label { color: #16a34a !important; font-weight: 600; }

    .item-hover-rose:hover { background-color: #fff1f2; }
    .item-hover-rose:hover .item-label { color: #e11d48 !important; font-weight: 600; }

    .item-hover-sky:hover { background-color: #f0f9ff; }
    .item-hover-sky:hover .item-label { color: #0284c7 !important; font-weight: 600; }

    .item-hover-amber:hover { background-color: #fffbeb; }
    .item-hover-amber:hover .item-label { color: #d97706 !important; font-weight: 600; }

    .item-hover-indigo:hover { background-color: #eef2ff; }
    .item-hover-indigo:hover .item-label { color: #4338ca !important; font-weight: 600; }

    .item-hover-orange:hover { background-color: #fff7ed; }
    .item-hover-orange:hover .item-label { color: #ea580c !important; font-weight: 600; }

    .item-hover-purple:hover { background-color: #faf5ff; }
    .item-hover-purple:hover .item-label { color: #7c3aed !important; font-weight: 600; }

    .item-hover-cyan:hover { background-color: #ecfeff; }
    .item-hover-cyan:hover .item-label { color: #0891b2 !important; font-weight: 600; }

    .item-hover-blue:hover { background-color: #eff6ff; }
    .item-hover-blue:hover .item-label { color: #2563eb !important; font-weight: 600; }

    .item-hover-teal:hover { background-color: #f0fdfa; }
    .item-hover-teal:hover .item-label { color: #0d9488 !important; font-weight: 600; }

    .item-hover-pink:hover { background-color: #fdf2f8; }
    .item-hover-pink:hover .item-label { color: #db2777 !important; font-weight: 600; }

    .item-hover-violet:hover { background-color: #faf5ff; }
    .item-hover-violet:hover .item-label { color: #6d28d9 !important; font-weight: 600; }

    .item-hover-yellow:hover { background-color: #fefce8; }
    .item-hover-yellow:hover .item-label { color: #ca8a04 !important; font-weight: 600; }

    .item-hover-lime:hover { background-color: #f7fee7; }
    .item-hover-lime:hover .item-label { color: #65a30d !important; font-weight: 600; }

    .item-hover-emerald:hover { background-color: #ecfdf5; }
    .item-hover-emerald:hover .item-label { color: #059669 !important; font-weight: 600; }

    .item-hover-coral:hover { background-color: #fef2f2; }
    .item-hover-coral:hover .item-label { color: #dc2626 !important; font-weight: 600; }

    .item-hover-mint:hover { background-color: #f0fdfa; }
    .item-hover-mint:hover .item-label { color: #047857 !important; font-weight: 600; }

    .item-hover-softgreen:hover { background-color: #f0fdf4; }
    .item-hover-softgreen:hover .item-label { color: #16a34a !important; font-weight: 600; }

    /* Distinct pastel icon badges matching reference */
    .badge-green { background-color: #dcfce7; color: #15803d; }
    .badge-rose { background-color: #ffe4e6; color: #e11d48; }
    .badge-sky { background-color: #e0f2fe; color: #0284c7; }
    .badge-amber { background-color: #fef3c7; color: #d97706; }
    .badge-indigo { background-color: #e0e7ff; color: #4338ca; }
    .badge-orange { background-color: #ffedd5; color: #ea580c; }
    .badge-purple { background-color: #ede9fe; color: #7c3aed; }
    .badge-cyan { background-color: #cffafe; color: #0891b2; }
    .badge-blue { background-color: #dbeafe; color: #2563eb; }
    .badge-teal { background-color: #ccfbf1; color: #0d9488; }
    .badge-pink { background-color: #fce7f3; color: #db2777; }
    .badge-violet { background-color: #ede9fe; color: #6d28d9; }
    .badge-yellow { background-color: #fef9c3; color: #ca8a04; }
    .badge-lime { background-color: #ecfccb; color: #65a30d; }
    .badge-emerald { background-color: #d1fae5; color: #059669; }
    .badge-coral { background-color: #fee2e2; color: #dc2626; }
    .badge-mint { background-color: #d1fae5; color: #047857; }
    .badge-softgreen { background-color: #dcfce7; color: #16a34a; }

    /* Right Zone */
    .topbar-right-zone {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    .director-user-info {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      color: #334155;
    }
    .user-icon {
      color: #475569;
    }
    .director-title {
      font-size: 0.8125rem;
      font-weight: 600;
      color: #1e293b;
      letter-spacing: 0.03em;
    }

    .logout-action-btn {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      border: none;
      background: transparent;
      color: #475569;
      font-size: 0.8125rem;
      font-weight: 500;
      cursor: pointer;
      padding: 0.25rem 0.4rem;
      border-radius: 4px;
      transition: color 0.15s ease;
      font-family: inherit;
    }
    .logout-action-btn:hover {
      color: #dc2626;
    }

    /* Main Viewport */
    .content-viewport {
      flex: 1;
      width: 100%;
      background-color: #f8fafc;
    }

    @media (max-width: 900px) {
      .top-nav-menu {
        display: none;
      }
    }
  `]
})
export class LayoutComponent {
  activeDropdown: string | null = null;

  toggleDropdown(menu: string, event: MouseEvent) {
    event.stopPropagation();
    this.activeDropdown = this.activeDropdown === menu ? null : menu;
  }

  closeDropdowns() {
    this.activeDropdown = null;
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.closeDropdowns();
  }

  onLogout() {
    alert('Logged out from Director session.');
  }
}
