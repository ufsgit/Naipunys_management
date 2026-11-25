import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
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
            <!-- Create New (Primary blue pill when active, clean subtle pill otherwise) -->
            <a
              routerLink="/students/create"
              class="top-menu-btn"
              [class.active-create]="isCreateNewActive()"
            >
              <app-icon name="user-plus" [size]="14"></app-icon>
              <span>Create New</span>
            </a>

            <!-- Student List -->
            <a
              routerLink="/students/list"
              class="top-menu-btn"
              [class.active-students]="isStudentListActive()"
            >
              <app-icon name="users" [size]="14"></app-icon>
              <span>Student List</span>
            </a>

            <!-- Accounts Dropdown with Rich Colored Contents -->
            <div class="nav-dropdown" [class.open]="activeDropdown === 'accounts'">
              <button
                type="button"
                class="top-menu-btn top-menu-dropdown-btn"
                [class.active-accounts]="isAccountsActive()"
                (click)="toggleDropdown('accounts', $event)"
              >
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
                  </div>
                </div>
              </div>
            </div>

            <!-- Report Dropdown (Refined with colorful modern badges) -->
            <div class="nav-dropdown" [class.open]="activeDropdown === 'reports'">
              <button
                type="button"
                class="top-menu-btn top-menu-dropdown-btn"
                [class.active-reports]="isReportsActive()"
                (click)="toggleDropdown('reports', $event)"
              >
                <app-icon name="pie-chart" [size]="14"></app-icon>
                <span>Report</span>
                <app-icon name="chevron-down" [size]="12" customClass="dropdown-arrow"></app-icon>
              </button>

              <div class="reports-dropdown-panel" *ngIf="activeDropdown === 'reports'" (click)="$event.stopPropagation()">
                <div class="reports-menu-header">
                  <div class="reports-header-icon">
                    <app-icon name="pie-chart" [size]="17"></app-icon>
                  </div>
                  <div class="header-text-group">
                    <h4 class="reports-header-title">Reports & Analytics</h4>
                  </div>
                </div>

                <div class="reports-menu-body">
                  <div class="category-capsule capsule-blue">FEES & FINANCIAL REPORTS</div>
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
                  </div>
                </div>
              </div>
            </div>

            <!-- Settings Dropdown (Only the 9 requested items with modern colorful design) -->
            <div class="nav-dropdown" [class.open]="activeDropdown === 'settings'">
              <button
                type="button"
                class="top-menu-btn top-menu-dropdown-btn"
                [class.active-settings]="isSettingsActive()"
                (click)="toggleDropdown('settings', $event)"
              >
                <app-icon name="settings" [size]="14"></app-icon>
                <span>Settings</span>
                <app-icon name="chevron-down" [size]="12" customClass="dropdown-arrow"></app-icon>
              </button>

              <div class="settings-dropdown-panel" *ngIf="activeDropdown === 'settings'" (click)="$event.stopPropagation()">
                <!-- Top Header Bar -->
                <div class="settings-menu-header">
                  <div class="settings-header-icon">
                    <app-icon name="sliders" [size]="18"></app-icon>
                  </div>
                  <div class="header-text-group">
                    <h3 class="settings-header-title">Settings & System Controls</h3>
                  </div>
                </div>

                <!-- 3 Categorized Columns with only the 9 requested items -->
                <div class="settings-menu-grid">
                  <!-- Column 1: Course & Users -->
                  <div class="mega-column">
                    <div class="category-capsule capsule-blue">COURSE & USERS</div>
                    <div class="mega-items-list">
                      <a routerLink="/setup/courses" class="mega-item item-hover-orange" (click)="closeDropdowns()">
                        <div class="item-icon-badge badge-orange">
                          <app-icon name="book-open" [size]="16"></app-icon>
                        </div>
                        <span class="item-label">Course</span>
                      </a>

                      <a routerLink="/setup/users/list" class="mega-item item-hover-indigo" (click)="closeDropdowns()">
                        <div class="item-icon-badge badge-indigo">
                          <app-icon name="users" [size]="16"></app-icon>
                        </div>
                        <span class="item-label">User Details</span>
                      </a>

                      <a routerLink="/setup/roles" class="mega-item item-hover-amber" (click)="closeDropdowns()">
                        <div class="item-icon-badge badge-amber">
                          <app-icon name="user-check" [size]="16"></app-icon>
                        </div>
                        <span class="item-label">User Role</span>
                      </a>
                    </div>
                  </div>

                  <!-- Column 2: Basic Settings -->
                  <div class="mega-column">
                    <div class="category-capsule capsule-green">BASIC SETTINGS</div>
                    <div class="mega-items-list">
                      <a routerLink="/settings/followup-types" class="mega-item item-hover-violet" (click)="closeDropdowns()">
                        <div class="item-icon-badge badge-violet">
                          <app-icon name="list" [size]="16"></app-icon>
                        </div>
                        <span class="item-label">Follow-up Type</span>
                      </a>

                      <a routerLink="/settings/enquiry-sources" class="mega-item item-hover-pink" (click)="closeDropdowns()">
                        <div class="item-icon-badge badge-pink">
                          <app-icon name="help-circle" [size]="16"></app-icon>
                        </div>
                        <span class="item-label">Enquiry Source</span>
                      </a>

                      <a routerLink="/settings/status-list" class="mega-item item-hover-teal" (click)="closeDropdowns()">
                        <div class="item-icon-badge badge-teal">
                          <app-icon name="activity" [size]="16"></app-icon>
                        </div>
                        <span class="item-label">Status</span>
                      </a>
                    </div>
                  </div>

                  <!-- Column 3: Organization -->
                  <div class="mega-column">
                    <div class="category-capsule capsule-teal">ORGANIZATION</div>
                    <div class="mega-items-list">
                      <a routerLink="/departments/list" class="mega-item item-hover-purple" (click)="closeDropdowns()">
                        <div class="item-icon-badge badge-purple">
                          <app-icon name="git-branch" [size]="16"></app-icon>
                        </div>
                        <span class="item-label">Department</span>
                      </a>

                      <a routerLink="/branches/list" class="mega-item item-hover-cyan" (click)="closeDropdowns()">
                        <div class="item-icon-badge badge-cyan">
                          <app-icon name="building" [size]="16"></app-icon>
                        </div>
                        <span class="item-label">Branch</span>
                      </a>

                      <a routerLink="/company-info" class="mega-item item-hover-blue" (click)="closeDropdowns()">
                        <div class="item-icon-badge badge-blue">
                          <app-icon name="briefcase" [size]="16"></app-icon>
                        </div>
                        <span class="item-label">Company Info</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>

        <!-- Right: Logout -->
        <div class="topbar-right-zone">
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
      gap: 0.65rem;
    }

    /* Common Base Nav Button / Link */
    .top-menu-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.42rem 0.85rem;
      font-size: 0.8125rem;
      font-weight: 500;
      color: #334155;
      background: transparent;
      border: none;
      border-radius: 6px;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.15s ease;
      font-family: inherit;
      white-space: nowrap;
    }

    .top-menu-btn:hover {
      background-color: #f1f5f9;
      color: #0f172a;
    }

    /* 1. Create New Active: Royal Blue */
    .top-menu-btn.active-create {
      background-color: #2563eb !important;
      color: #ffffff !important;
      font-weight: 600;
      box-shadow: 0 1px 3px rgba(37, 99, 235, 0.25);
    }
    .top-menu-btn.active-create:hover {
      background-color: #1d4ed8 !important;
    }

    /* 2. Student List Active: Emerald Green */
    .top-menu-btn.active-students {
      background-color: #16a34a !important;
      color: #ffffff !important;
      font-weight: 600;
      box-shadow: 0 1px 3px rgba(22, 163, 74, 0.25);
    }
    .top-menu-btn.active-students:hover {
      background-color: #15803d !important;
    }

    /* 3. Accounts Active: Amber / Orange */
    .top-menu-btn.active-accounts {
      background-color: #ea580c !important;
      color: #ffffff !important;
      font-weight: 600;
      box-shadow: 0 1px 3px rgba(234, 88, 12, 0.25);
    }
    .top-menu-btn.active-accounts:hover {
      background-color: #c2410c !important;
    }
    .top-menu-btn.active-accounts .dropdown-arrow {
      color: #ffffff !important;
    }

    /* 4. Report Active: Royal Purple */
    .top-menu-btn.active-reports {
      background-color: #7c3aed !important;
      color: #ffffff !important;
      font-weight: 600;
      box-shadow: 0 1px 3px rgba(124, 58, 237, 0.25);
    }
    .top-menu-btn.active-reports:hover {
      background-color: #6d28d9 !important;
    }
    .top-menu-btn.active-reports .dropdown-arrow {
      color: #ffffff !important;
    }

    /* 5. Settings Active: Deep Indigo */
    .top-menu-btn.active-settings {
      background-color: #4f46e5 !important;
      color: #ffffff !important;
      font-weight: 600;
      box-shadow: 0 1px 3px rgba(79, 70, 229, 0.25);
    }
    .top-menu-btn.active-settings:hover {
      background-color: #4338ca !important;
    }
    .top-menu-btn.active-settings .dropdown-arrow {
      color: #ffffff !important;
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
    /* Dropdown Panels (Accounts & Reports) matching clean modern theme */
    .accounts-dropdown-panel,
    .reports-dropdown-panel {
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

    /* Settings Mega Dropdown Panel matching reference image */
    .settings-dropdown-panel {
      position: absolute;
      top: calc(100% + 8px);
      left: -220px;
      width: 700px;
      max-width: 90vw;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      box-shadow: 0 20px 45px -10px rgba(15, 23, 42, 0.15), 0 4px 12px rgba(0, 0, 0, 0.04);
      z-index: 300;
      overflow: hidden;
      animation: fadeInMega 0.15s ease-out;
    }

    .settings-menu-header {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 1.1rem 1.6rem;
      border-bottom: 1px solid #f1f5f9;
      background: #ffffff;
    }

    .settings-header-icon {
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

    .settings-header-title {
      font-size: 1.05rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
      letter-spacing: -0.01em;
    }

    .settings-menu-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.35rem;
      padding: 1.35rem 1.6rem 1.6rem;
      background: #ffffff;
    }

    .mega-column {
      display: flex;
      flex-direction: column;
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

    .accounts-menu-header,
    .reports-menu-header {
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

    .reports-header-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 10px rgba(99, 102, 241, 0.25);
    }

    .accounts-header-title,
    .reports-header-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
      letter-spacing: -0.01em;
    }

    .accounts-menu-body,
    .reports-menu-body {
      padding: 1.1rem 1.25rem 1.25rem;
      background: #ffffff;
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
      margin-bottom: 0.9rem;
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
      padding: 0.55rem 0.65rem;
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

  constructor(public router: Router) {}

  isCreateNewActive(): boolean {
    return this.router.url.startsWith('/students/create');
  }

  isStudentListActive(): boolean {
    return this.router.url.startsWith('/students/list') ||
           this.router.url.startsWith('/students/detail') ||
           this.router.url.startsWith('/students/follow-up');
  }

  isAccountsActive(): boolean {
    return this.router.url.startsWith('/accounts') ||
           this.router.url.startsWith('/receipts');
  }

  isReportsActive(): boolean {
    return this.router.url.startsWith('/reports');
  }

  isSettingsActive(): boolean {
    return this.router.url.startsWith('/setup') ||
           this.router.url.startsWith('/settings') ||
           this.router.url.startsWith('/departments') ||
           this.router.url.startsWith('/branches') ||
           this.router.url.startsWith('/company-info');
  }

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
