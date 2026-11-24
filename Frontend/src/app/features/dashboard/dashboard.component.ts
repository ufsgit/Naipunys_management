import { IconComponent, ModalComponent, ConfirmDialogComponent, PageHeaderComponent, PaginationComponent, FilterBarComponent } from '../../shared/index';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MockDataService, Student, Receipt, StudentFollowUp } from '../../core/mock-data.service';

interface FollowUpRow {
  initials: string;
  avatarBg: string;
  avatarColor: string;
  name: string;
  note: string;
  mobile: string;
  nextFollowUp: string;
}

interface FeeReceiptRow {
  student: string;
  type: string;
  amount: number;
  date: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IconComponent,
    FormsModule
  ],
  template: `
    <div class="dashboard-container">
      <!-- 1. Top 5 Metric Cards -->
      <div class="stats-row">
        <!-- Total Students -->
        <div class="stat-card stat-blue">
          <div class="stat-header">
            <span class="stat-icon-wrap icon-blue">
              <app-icon name="users" [size]="16"></app-icon>
            </span>
            <span class="stat-label">Total Students</span>
          </div>
          <div class="stat-body">
            <span class="stat-number">148</span>
            <div class="mini-chart mini-chart-blue">
              <span class="bar b1"></span>
              <span class="bar b2"></span>
              <span class="bar b3"></span>
              <span class="bar b4"></span>
            </div>
          </div>
        </div>

        <!-- Active Courses -->
        <div class="stat-card stat-purple">
          <div class="stat-header">
            <span class="stat-icon-wrap icon-purple">
              <app-icon name="book-open" [size]="16"></app-icon>
            </span>
            <span class="stat-label">Active Courses</span>
          </div>
          <div class="stat-body">
            <span class="stat-number">6</span>
            <div class="mini-chart mini-chart-purple">
              <span class="bar b1"></span>
              <span class="bar b2"></span>
              <span class="bar b3"></span>
              <span class="bar b4"></span>
            </div>
          </div>
        </div>

        <!-- Follow-ups Due -->
        <div class="stat-card stat-amber">
          <div class="stat-header">
            <span class="stat-icon-wrap icon-amber">
              <app-icon name="clock" [size]="16"></app-icon>
            </span>
            <span class="stat-label">Follow-ups Due</span>
          </div>
          <div class="stat-body">
            <span class="stat-number">8</span>
            <div class="mini-chart mini-chart-amber">
              <span class="bar b1"></span>
              <span class="bar b2"></span>
              <span class="bar b3"></span>
              <span class="bar b4"></span>
            </div>
          </div>
        </div>

        <!-- Fee Collected -->
        <div class="stat-card stat-teal">
          <div class="stat-header">
            <span class="stat-icon-wrap icon-teal">
              <app-icon name="receipt" [size]="16"></app-icon>
            </span>
            <span class="stat-label">Fee Collected</span>
          </div>
          <div class="stat-body">
            <span class="stat-number">2,45,000</span>
            <div class="mini-chart mini-chart-teal">
              <span class="bar b1"></span>
              <span class="bar b2"></span>
              <span class="bar b3"></span>
              <span class="bar b4"></span>
            </div>
          </div>
        </div>

        <!-- Fee Pending -->
        <div class="stat-card stat-rose">
          <div class="stat-header">
            <span class="stat-icon-wrap icon-rose">
              <app-icon name="dollar-sign" [size]="16"></app-icon>
            </span>
            <span class="stat-label">Fee Pending</span>
          </div>
          <div class="stat-body">
            <span class="stat-number">38,500</span>
            <div class="mini-chart mini-chart-rose">
              <span class="bar b1"></span>
              <span class="bar b2"></span>
              <span class="bar b3"></span>
              <span class="bar b4"></span>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Dashboard Overview & Quick Action Buttons Bar -->
      <div class="action-bar-card">
        <div class="overview-title-group">
          <h2>Dashboard Overview</h2>
          <span class="overview-date">{{ currentDateStr }}</span>
        </div>

        <div class="quick-action-buttons">
          <a routerLink="/students/create" class="action-pill pill-green">
            <app-icon name="user-plus" [size]="16"></app-icon>
            <span>Create New Student</span>
          </a>

          <a routerLink="/students/list" class="action-pill pill-blue">
            <app-icon name="users" [size]="16"></app-icon>
            <span>Student List</span>
          </a>

          <a routerLink="/setup/courses" class="action-pill pill-purple">
            <app-icon name="graduation-cap" [size]="16"></app-icon>
            <span>Course</span>
          </a>

          <a routerLink="/reports/fee-pending" class="action-pill pill-amber">
            <app-icon name="file-text" [size]="16"></app-icon>
            <span>Fees Pending Report</span>
          </a>
        </div>
      </div>

      <!-- 3. Middle Section: Pipeline, Monthly Performance, Enquiry Sources -->
      <div class="middle-grid">
        <!-- Student Status Pipeline -->
        <div class="panel-card pipeline-card">
          <div class="panel-header">
            <div class="panel-title">
              <app-icon name="filter" [size]="16" customClass="panel-icon-blue"></app-icon>
              <span>Student Status Pipeline</span>
            </div>
          </div>

          <div class="pipeline-list">
            <!-- Total Enquiries -->
            <div class="pipeline-item">
              <div class="pipe-bar-col">
                <div class="pipe-bar bg-pipe-blue" style="width: 100%;"></div>
                <div class="pipe-meta">
                  <span class="pipe-count">148</span>
                  <span class="pipe-label">Total Enquiries</span>
                </div>
              </div>
              <span class="pipe-badge badge-tint-blue">100%</span>
            </div>

            <!-- Running -->
            <div class="pipeline-item">
              <div class="pipe-bar-col">
                <div class="pipe-bar bg-pipe-green" style="width: 75.7%;"></div>
                <div class="pipe-meta">
                  <span class="pipe-count">112</span>
                  <span class="pipe-label">Running</span>
                </div>
              </div>
              <span class="pipe-badge badge-tint-green">75.7%</span>
            </div>

            <!-- Follow-up Due -->
            <div class="pipeline-item">
              <div class="pipe-bar-col">
                <div class="pipe-bar bg-pipe-amber" style="width: 50%;"></div>
                <div class="pipe-meta">
                  <span class="pipe-count">18</span>
                  <span class="pipe-label">Follow-up Due</span>
                </div>
              </div>
              <span class="pipe-badge badge-tint-amber">12.2%</span>
            </div>

            <!-- Completed -->
            <div class="pipeline-item">
              <div class="pipe-bar-col">
                <div class="pipe-bar bg-pipe-purple" style="width: 38%;"></div>
                <div class="pipe-meta">
                  <span class="pipe-count">12</span>
                  <span class="pipe-label">Completed</span>
                </div>
              </div>
              <span class="pipe-badge badge-tint-purple">8.1%</span>
            </div>

            <!-- Stopped -->
            <div class="pipeline-item">
              <div class="pipe-bar-col">
                <div class="pipe-bar bg-pipe-red" style="width: 25%;"></div>
                <div class="pipe-meta">
                  <span class="pipe-count">6</span>
                  <span class="pipe-label">Stopped</span>
                </div>
              </div>
              <span class="pipe-badge badge-tint-red">4.0%</span>
            </div>
          </div>
        </div>

        <!-- Monthly Performance Chart -->
        <div class="panel-card chart-card">
          <div class="panel-header" style="justify-content: space-between;">
            <div class="panel-title">
              <app-icon name="bar-chart" [size]="16" customClass="panel-icon-blue"></app-icon>
              <span>Monthly Performance</span>
            </div>

            <!-- Period Tabs -->
            <div class="period-tabs">
              <button
                type="button"
                class="tab-btn"
                [class.active]="selectedPeriod === '6M'"
                (click)="selectedPeriod = '6M'"
              >6M</button>
              <button
                type="button"
                class="tab-btn"
                [class.active]="selectedPeriod === '12M'"
                (click)="selectedPeriod = '12M'"
              >12M</button>
              <button
                type="button"
                class="tab-btn"
                [class.active]="selectedPeriod === '2026'"
                (click)="selectedPeriod = '2026'"
              >2026</button>
            </div>
          </div>

          <!-- Legend -->
          <div class="chart-legend">
            <span class="legend-item"><span class="dot dot-blue"></span> Enquiries</span>
            <span class="legend-item"><span class="dot dot-green"></span> Joined</span>
            <span class="legend-item"><span class="dot dot-purple"></span> Completed</span>
          </div>

          <!-- Grouped Bar Chart SVG -->
          <div class="chart-container">
            <svg class="performance-svg" viewBox="0 0 500 200" preserveAspectRatio="none">
              <!-- Grid lines -->
              <line x1="20" y1="40" x2="480" y2="40" stroke="#f1f5f9" stroke-width="1" />
              <line x1="20" y1="90" x2="480" y2="90" stroke="#f1f5f9" stroke-width="1" />
              <line x1="20" y1="140" x2="480" y2="140" stroke="#f1f5f9" stroke-width="1" />
              <line x1="20" y1="180" x2="480" y2="180" stroke="#e2e8f0" stroke-width="1" />

              <!-- Jun -->
              <g transform="translate(45, 0)">
                <rect x="0" y="125" width="8" height="55" rx="3" fill="#2563eb" />
                <rect x="12" y="140" width="8" height="40" rx="3" fill="#16a34a" />
                <rect x="24" y="155" width="8" height="25" rx="3" fill="#9333ea" />
                <text x="16" y="196" text-anchor="middle" class="axis-label">Jun</text>
              </g>

              <!-- Jul -->
              <g transform="translate(115, 0)">
                <rect x="0" y="110" width="8" height="70" rx="3" fill="#2563eb" />
                <rect x="12" y="130" width="8" height="50" rx="3" fill="#16a34a" />
                <rect x="24" y="160" width="8" height="20" rx="3" fill="#9333ea" />
                <text x="16" y="196" text-anchor="middle" class="axis-label">Jul</text>
              </g>

              <!-- Aug -->
              <g transform="translate(185, 0)">
                <rect x="0" y="100" width="8" height="80" rx="3" fill="#2563eb" />
                <rect x="12" y="125" width="8" height="55" rx="3" fill="#16a34a" />
                <rect x="24" y="150" width="8" height="30" rx="3" fill="#9333ea" />
                <text x="16" y="196" text-anchor="middle" class="axis-label">Aug</text>
              </g>

              <!-- Sep -->
              <g transform="translate(255, 0)">
                <rect x="0" y="80" width="8" height="100" rx="3" fill="#2563eb" />
                <rect x="12" y="110" width="8" height="70" rx="3" fill="#16a34a" />
                <rect x="24" y="145" width="8" height="35" rx="3" fill="#9333ea" />
                <text x="16" y="196" text-anchor="middle" class="axis-label">Sep</text>
              </g>

              <!-- Oct -->
              <g transform="translate(325, 0)">
                <rect x="0" y="60" width="8" height="120" rx="3" fill="#2563eb" />
                <rect x="12" y="95" width="8" height="85" rx="3" fill="#16a34a" />
                <rect x="24" y="140" width="8" height="40" rx="3" fill="#9333ea" />
                <text x="16" y="196" text-anchor="middle" class="axis-label">Oct</text>
              </g>

              <!-- Nov -->
              <g transform="translate(395, 0)">
                <rect x="0" y="45" width="8" height="135" rx="3" fill="#2563eb" />
                <rect x="12" y="70" width="8" height="110" rx="3" fill="#16a34a" />
                <rect x="24" y="130" width="8" height="50" rx="3" fill="#9333ea" />
                <text x="16" y="196" text-anchor="middle" class="axis-label">Nov</text>
              </g>
            </svg>
          </div>
        </div>

        <!-- Enquiry Sources Donut Chart -->
        <div class="panel-card sources-card">
          <div class="panel-header">
            <div class="panel-title">
              <app-icon name="info" [size]="16" customClass="panel-icon-blue"></app-icon>
              <span>Enquiry Sources</span>
            </div>
          </div>

          <div class="donut-wrap">
            <div class="donut-chart-box">
              <svg viewBox="0 0 160 160" class="donut-svg">
                <!-- Circle background -->
                <circle cx="80" cy="80" r="55" fill="none" stroke="#f1f5f9" stroke-width="18" />

                <!-- Walk-in (71 / 148 = 48%) -> stroke-dasharray: 165, 345 -->
                <circle
                  cx="80" cy="80" r="55"
                  fill="none"
                  stroke="#2563eb"
                  stroke-width="18"
                  stroke-dasharray="165 345"
                  stroke-dashoffset="0"
                  transform="rotate(-90 80 80)"
                />

                <!-- Referral (41 / 148 = 28%) -> stroke-dasharray: 96, 345 -->
                <circle
                  cx="80" cy="80" r="55"
                  fill="none"
                  stroke="#16a34a"
                  stroke-width="18"
                  stroke-dasharray="96 345"
                  stroke-dashoffset="-165"
                  transform="rotate(-90 80 80)"
                />

                <!-- Advertisement (36 / 148 = 24%) -> stroke-dasharray: 84, 345 -->
                <circle
                  cx="80" cy="80" r="55"
                  fill="none"
                  stroke="#9333ea"
                  stroke-width="18"
                  stroke-dasharray="84 345"
                  stroke-dashoffset="-261"
                  transform="rotate(-90 80 80)"
                />
              </svg>

              <!-- Donut Center Text -->
              <div class="donut-center-label">
                <span class="donut-total">148</span>
                <span class="donut-sub">Students</span>
              </div>
            </div>

            <!-- Legend Table -->
            <div class="sources-legend-list">
              <div class="source-row">
                <div class="source-left">
                  <span class="dot dot-blue"></span>
                  <span>Walk-in</span>
                </div>
                <strong class="source-val">71</strong>
              </div>
              <div class="source-row">
                <div class="source-left">
                  <span class="dot dot-green"></span>
                  <span>Referral</span>
                </div>
                <strong class="source-val">41</strong>
              </div>
              <div class="source-row">
                <div class="source-left">
                  <span class="dot dot-purple"></span>
                  <span>Advertisement</span>
                </div>
                <strong class="source-val">36</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. Bottom Section: Pending Follow-ups & Recent Fee Receipts -->
      <div class="bottom-grid">
        <!-- Pending Follow-ups Table -->
        <div class="panel-card table-panel">
          <div class="panel-header" style="justify-content: space-between;">
            <div class="panel-title">
              <app-icon name="phone" [size]="16" customClass="panel-icon-blue"></app-icon>
              <span>Pending Follow-ups</span>
            </div>
            <a routerLink="/students/follow-up" class="view-all-link">View All</a>
          </div>

          <div class="table-wrap">
            <table class="compact-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Note</th>
                  <th>Mobile</th>
                  <th>Next FollowUp</th>
                  <th style="text-align: right;">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let row of pendingFollowUps">
                  <td>
                    <div class="student-cell">
                      <span
                        class="initial-avatar"
                        [style.background-color]="row.avatarBg"
                        [style.color]="row.avatarColor"
                      >
                        {{ row.initials }}
                      </span>
                      <span class="student-name-text">{{ row.name }}</span>
                    </div>
                  </td>
                  <td class="note-cell">{{ row.note }}</td>
                  <td class="mobile-cell">{{ row.mobile }}</td>
                  <td class="due-date-cell">{{ row.nextFollowUp }}</td>
                  <td style="text-align: right;">
                    <a routerLink="/students/follow-up" class="followup-action-btn">FollowUp</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Recent Fee Receipts Table -->
        <div class="panel-card table-panel">
          <div class="panel-header" style="justify-content: space-between;">
            <div class="panel-title">
              <app-icon name="receipt" [size]="16" customClass="panel-icon-blue"></app-icon>
              <span>Recent Fee Receipts</span>
            </div>
            <a routerLink="/receipts" class="view-all-link">View All</a>
          </div>

          <div class="table-wrap">
            <table class="compact-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th style="text-align: right;">Amount</th>
                  <th style="text-align: right;">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let rec of recentReceipts">
                  <td>
                    <div class="receipt-student-name">{{ rec.student }}</div>
                    <div class="receipt-type-sub">{{ rec.type }}</div>
                  </td>
                  <td style="text-align: right; font-weight: 600; font-family: inherit;">
                    {{ rec.amount | number }}
                  </td>
                  <td style="text-align: right; color: var(--text-muted); font-size: 0.8rem;">
                    {{ rec.date }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      flex-direction: column;
      gap: 1.15rem;
      padding: 0.25rem 0.5rem;
    }

    /* 1. Stats Row */
    .stats-row {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 1rem;
    }
    @media (max-width: 1200px) {
      .stats-row {
        grid-template-columns: repeat(3, 1fr);
      }
    }
    @media (max-width: 768px) {
      .stats-row {
        grid-template-columns: 1fr;
      }
    }

    .stat-card {
      border-radius: 12px;
      padding: 1rem 1.15rem;
      border: 1px solid rgba(0, 0, 0, 0.05);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }
    .stat-blue {
      background-color: #eff6ff;
      border-color: #dbeafe;
    }
    .stat-purple {
      background-color: #faf5ff;
      border-color: #f3e8ff;
    }
    .stat-amber {
      background-color: #fefce8;
      border-color: #fef08a;
    }
    .stat-teal {
      background-color: #f0fdfa;
      border-color: #ccfbf1;
    }
    .stat-rose {
      background-color: #fff1f2;
      border-color: #ffe4e6;
    }

    .stat-header {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      margin-bottom: 0.75rem;
    }
    .stat-icon-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .icon-blue { color: #2563eb; }
    .icon-purple { color: #7c3aed; }
    .icon-amber { color: #d97706; }
    .icon-teal { color: #0d9488; }
    .icon-rose { color: #e11d48; }

    .stat-label {
      font-size: 0.8rem;
      font-weight: 500;
      color: #475569;
    }
    .stat-body {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
    }
    .stat-number {
      font-size: 1.55rem;
      font-weight: 700;
      color: #0f172a;
      line-height: 1;
    }

    /* Mini charts */
    .mini-chart {
      display: flex;
      align-items: flex-end;
      gap: 3px;
      height: 24px;
    }
    .mini-chart .bar {
      width: 4px;
      border-radius: 2px;
    }
    .mini-chart-blue .bar { background-color: #3b82f6; }
    .mini-chart-purple .bar { background-color: #8b5cf6; }
    .mini-chart-amber .bar { background-color: #f59e0b; }
    .mini-chart-teal .bar { background-color: #14b8a6; }
    .mini-chart-rose .bar { background-color: #f43f5e; }

    .b1 { height: 35%; }
    .b2 { height: 55%; }
    .b3 { height: 80%; }
    .b4 { height: 100%; }

    /* 2. Action Bar */
    .action-bar-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 0.85rem 1.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.75rem;
    }
    .overview-title-group {
      display: flex;
      align-items: baseline;
      gap: 0.6rem;
    }
    .overview-title-group h2 {
      font-size: 1.05rem;
      font-weight: 600;
      color: #0f172a;
      margin: 0;
    }
    .overview-date {
      font-size: 0.8rem;
      color: #64748b;
    }

    .quick-action-buttons {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      flex-wrap: wrap;
    }
    .action-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.45rem 0.9rem;
      border-radius: 6px;
      font-size: 0.8125rem;
      font-weight: 600;
      color: #ffffff;
      text-decoration: none;
      transition: opacity 0.15s ease;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }
    .action-pill:hover {
      opacity: 0.92;
      text-decoration: none;
      color: #ffffff;
    }
    .pill-green { background-color: #15803d; }
    .pill-blue { background-color: #2563eb; }
    .pill-purple { background-color: #6d28d9; }
    .pill-amber { background-color: #b45309; }

    /* 3. Middle Section */
    .middle-grid {
      display: grid;
      grid-template-columns: 1fr 1.6fr 1fr;
      gap: 1rem;
    }
    @media (max-width: 1200px) {
      .middle-grid {
        grid-template-columns: 1fr;
      }
    }

    .panel-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1.15rem;
      display: flex;
      flex-direction: column;
    }
    .panel-header {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
    }
    .panel-title {
      font-size: 0.9rem;
      font-weight: 600;
      color: #0f172a;
      display: flex;
      align-items: center;
      gap: 0.45rem;
    }
    .panel-icon-blue {
      color: #2563eb;
    }

    /* Pipeline */
    .pipeline-list {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
      flex: 1;
      justify-content: center;
    }
    .pipeline-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
    }
    .pipe-bar-col {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .pipe-bar {
      height: 14px;
      border-radius: 4px;
    }
    .bg-pipe-blue { background-color: #2563eb; }
    .bg-pipe-green { background-color: #16a34a; }
    .bg-pipe-amber { background-color: #c2410c; }
    .bg-pipe-purple { background-color: #7c3aed; }
    .bg-pipe-red { background-color: #dc2626; }

    .pipe-meta {
      display: flex;
      align-items: baseline;
      gap: 0.4rem;
    }
    .pipe-count {
      font-size: 0.85rem;
      font-weight: 700;
      color: #0f172a;
    }
    .pipe-label {
      font-size: 0.725rem;
      color: #64748b;
    }

    .pipe-badge {
      font-size: 0.7rem;
      font-weight: 600;
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
      min-width: 46px;
      text-align: center;
    }
    .badge-tint-blue { background-color: #eff6ff; color: #2563eb; }
    .badge-tint-green { background-color: #f0fdf4; color: #16a34a; }
    .badge-tint-amber { background-color: #fffbeb; color: #b45309; }
    .badge-tint-purple { background-color: #faf5ff; color: #7c3aed; }
    .badge-tint-red { background-color: #fef2f2; color: #dc2626; }

    /* Performance Chart */
    .period-tabs {
      display: flex;
      gap: 0.25rem;
      background: #f1f5f9;
      padding: 2px;
      border-radius: 6px;
    }
    .tab-btn {
      border: none;
      background: transparent;
      padding: 0.2rem 0.55rem;
      font-size: 0.7rem;
      font-weight: 600;
      color: #64748b;
      border-radius: 4px;
      cursor: pointer;
    }
    .tab-btn.active {
      background: #ffffff;
      color: #0f172a;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }
    .chart-legend {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 0.75rem;
      font-size: 0.75rem;
      color: #475569;
    }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.35rem;
    }
    .dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      display: inline-block;
    }
    .dot-blue { background-color: #2563eb; }
    .dot-green { background-color: #16a34a; }
    .dot-purple { background-color: #9333ea; }

    .chart-container {
      width: 100%;
      height: 180px;
    }
    .performance-svg {
      width: 100%;
      height: 100%;
    }
    .axis-label {
      font-size: 11px;
      fill: #64748b;
      font-family: inherit;
    }

    /* Donut Sources */
    .donut-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
    .donut-chart-box {
      position: relative;
      width: 140px;
      height: 140px;
    }
    .donut-svg {
      width: 100%;
      height: 100%;
    }
    .donut-center-label {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .donut-total {
      font-size: 1.35rem;
      font-weight: 700;
      color: #0f172a;
      line-height: 1;
    }
    .donut-sub {
      font-size: 0.7rem;
      color: #64748b;
      margin-top: 2px;
    }

    .sources-legend-list {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
      font-size: 0.8rem;
    }
    .source-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #475569;
    }
    .source-left {
      display: flex;
      align-items: center;
      gap: 0.45rem;
    }
    .source-val {
      color: #0f172a;
    }

    /* 4. Bottom Grid */
    .bottom-grid {
      display: grid;
      grid-template-columns: 1.6fr 1fr;
      gap: 1rem;
    }
    @media (max-width: 1024px) {
      .bottom-grid {
        grid-template-columns: 1fr;
      }
    }

    .view-all-link {
      font-size: 0.75rem;
      font-weight: 600;
      color: #2563eb;
      text-decoration: none;
    }
    .view-all-link:hover {
      text-decoration: underline;
    }

    .compact-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.785rem;
    }
    .compact-table th {
      text-align: left;
      font-weight: 600;
      color: #64748b;
      padding: 0.4rem 0.5rem;
      border-bottom: 1px solid #f1f5f9;
    }
    .compact-table td {
      padding: 0.55rem 0.5rem;
      border-bottom: 1px solid #f8fafc;
      vertical-align: middle;
    }
    .compact-table tbody tr:hover {
      background-color: #f8fafc;
    }

    .student-cell {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .initial-avatar {
      width: 24px;
      height: 24px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.65rem;
      font-weight: 700;
      flex-shrink: 0;
    }
    .student-name-text {
      font-weight: 600;
      color: #2563eb;
      letter-spacing: 0.02em;
    }
    .note-cell {
      color: #334155;
      font-weight: 500;
    }
    .mobile-cell {
      color: #475569;
      font-family: inherit;
    }
    .due-date-cell {
      color: #e11d48;
      font-weight: 500;
    }
    .followup-action-btn {
      font-size: 0.75rem;
      font-weight: 600;
      color: #2563eb;
      text-decoration: none;
    }
    .followup-action-btn:hover {
      text-decoration: underline;
    }

    .receipt-student-name {
      font-weight: 600;
      color: #2563eb;
    }
    .receipt-type-sub {
      font-size: 0.7rem;
      color: #64748b;
      margin-top: 1px;
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentDateStr = '24-Nov-2026';
  selectedPeriod: '6M' | '12M' | '2026' = '6M';

  pendingFollowUps: FollowUpRow[] = [
    { initials: 'PC', avatarBg: '#eff6ff', avatarColor: '#2563eb', name: 'PRIYANKA CLEMENT', note: 'IELTS ACADEMIC', mobile: '8891460293', nextFollowUp: '19-Nov-2026' },
    { initials: 'RC', avatarBg: '#f0fdf4', avatarColor: '#16a34a', name: 'ROBBIN CHIRACKAL JOSEPH', note: 'IELTS 1 MONTH', mobile: '9895162325', nextFollowUp: '19-Oct-2026' },
    { initials: 'AB', avatarBg: '#faf5ff', avatarColor: '#7c3aed', name: 'ANJANA BINDHU', note: 'UK VISITING VISA', mobile: '9544669647', nextFollowUp: '13-Oct-2026' },
    { initials: 'AS', avatarBg: '#fefce8', avatarColor: '#b45309', name: 'AWIN SANTHOSH', note: 'NZ DEPENDENT VISA', mobile: '9072933600', nextFollowUp: '10-Oct-2026' }
  ];

  recentReceipts: FeeReceiptRow[] = [
    { student: 'PRIYANKA CLEMENT', type: 'Fees', amount: 5000, date: '19-Nov' },
    { student: 'MEERA NAIR', type: 'Fees', amount: 12000, date: '18-Nov' },
    { student: 'ARJUN MENON', type: 'Book Amount', amount: 1500, date: '17-Nov' },
    { student: 'DEVIKA S', type: 'Fees', amount: 8000, date: '15-Nov' }
  ];

  constructor(private mockDataService: MockDataService) {}

  ngOnInit() {
    const today = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    this.currentDateStr = `${today.getDate()}-${months[today.getMonth()]}-${today.getFullYear()}`;
  }
}
