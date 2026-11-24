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

            <!-- Accounts Dropdown -->
            <div class="nav-dropdown" [class.open]="activeDropdown === 'accounts'">
              <button type="button" class="top-menu-dropdown-btn" (click)="toggleDropdown('accounts', $event)">
                <app-icon name="credit-card" [size]="14"></app-icon>
                <span>Accounts</span>
                <app-icon name="chevron-down" [size]="12" customClass="dropdown-arrow"></app-icon>
              </button>
              <div class="dropdown-flyout" *ngIf="activeDropdown === 'accounts'">
                <a routerLink="/accounts" class="flyout-item" (click)="closeDropdowns()">Accounts</a>
                <a routerLink="/receipts" class="flyout-item" (click)="closeDropdowns()">Receipt Management</a>
              </div>
            </div>

            <!-- Report Dropdown -->
            <div class="nav-dropdown" [class.open]="activeDropdown === 'reports'">
              <button type="button" class="top-menu-dropdown-btn" (click)="toggleDropdown('reports', $event)">
                <app-icon name="pie-chart" [size]="14"></app-icon>
                <span>Report</span>
                <app-icon name="chevron-down" [size]="12" customClass="dropdown-arrow"></app-icon>
              </button>
              <div class="dropdown-flyout" *ngIf="activeDropdown === 'reports'">
                <a routerLink="/reports/fee-receipt" class="flyout-item" (click)="closeDropdowns()">Fees Receipt Report</a>
                <a routerLink="/reports/fee-pending" class="flyout-item" (click)="closeDropdowns()">Fees Pending Report</a>
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
