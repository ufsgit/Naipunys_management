import { IconComponent } from '../../shared/index';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DataService, StudentListRow, Receipt, CourseItem, BranchItem, Account } from '../../core/data.service';

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

interface FeeSplitItem {
  name: string;
  amount: number;
  pct: number;
  color: string;
  dashArray: string;
  dashOffset: number;
}

interface AccountChip {
  name: string;
  balance: number;
  title: string;
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
      <!-- 1. Top 5 Metric Cards with Micro-Animations -->
      <div class="stats-row">
        <!-- Total Students -->
        <div class="stat-card stat-blue anim-card-1">
          <div class="stat-header">
            <span class="stat-icon-wrap icon-blue">
              <app-icon name="users" [size]="16"></app-icon>
            </span>
            <span class="stat-label">Total Students</span>
          </div>
          <div class="stat-body">
            <span class="stat-number">{{ totalStudents }}</span>
            <div class="mini-chart mini-chart-blue">
              <span class="bar b1"></span>
              <span class="bar b2"></span>
              <span class="bar b3"></span>
              <span class="bar b4"></span>
            </div>
          </div>
        </div>

        <!-- Active Courses -->
        <div class="stat-card stat-purple anim-card-2">
          <div class="stat-header">
            <span class="stat-icon-wrap icon-purple">
              <app-icon name="book-open" [size]="16"></app-icon>
            </span>
            <span class="stat-label">Active Courses</span>
          </div>
          <div class="stat-body">
            <span class="stat-number">{{ activeCoursesCount }}</span>
            <div class="mini-chart mini-chart-purple">
              <span class="bar b1"></span>
              <span class="bar b2"></span>
              <span class="bar b3"></span>
              <span class="bar b4"></span>
            </div>
          </div>
        </div>

        <!-- Follow-ups Due -->
        <div class="stat-card stat-amber anim-card-3">
          <div class="stat-header">
            <span class="stat-icon-wrap icon-amber">
              <app-icon name="clock" [size]="16"></app-icon>
            </span>
            <span class="stat-label">Follow-ups Due</span>
          </div>
          <div class="stat-body">
            <span class="stat-number">{{ followUpsDueCount }}</span>
            <div class="mini-chart mini-chart-amber">
              <span class="bar b1"></span>
              <span class="bar b2"></span>
              <span class="bar b3"></span>
              <span class="bar b4"></span>
            </div>
          </div>
        </div>

        <!-- Fee Collected -->
        <div class="stat-card stat-teal anim-card-4">
          <div class="stat-header">
            <span class="stat-icon-wrap icon-teal">
              <app-icon name="receipt" [size]="16"></app-icon>
            </span>
            <span class="stat-label">Fee Collected</span>
          </div>
          <div class="stat-body">
            <span class="stat-number">₹{{ feeCollected | number }}</span>
            <div class="mini-chart mini-chart-teal">
              <span class="bar b1"></span>
              <span class="bar b2"></span>
              <span class="bar b3"></span>
              <span class="bar b4"></span>
            </div>
          </div>
        </div>

        <!-- Fee Pending -->
        <div class="stat-card stat-rose anim-card-5">
          <div class="stat-header">
            <span class="stat-icon-wrap icon-rose">
              <app-icon name="dollar-sign" [size]="16"></app-icon>
            </span>
            <span class="stat-label">Fee Pending</span>
          </div>
          <div class="stat-body">
            <span class="stat-number">₹{{ feePending | number }}</span>
            <div class="mini-chart mini-chart-rose">
              <span class="bar b1"></span>
              <span class="bar b2"></span>
              <span class="bar b3"></span>
              <span class="bar b4"></span>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Action Bar with Branch Filter & Quick Actions -->
      <div class="action-bar-card">
        <div class="overview-title-group">
          <div class="overview-headline">
            <h2>Dashboard Overview</h2>
            <span class="live-dot" title="Live Synced"></span>
          </div>
          <span class="overview-date">{{ currentDateStr }}</span>
        </div>

        <div class="quick-action-buttons">
          <a routerLink="/students/create" class="action-pill pill-green">
            <app-icon name="user-plus" [size]="15"></app-icon>
            <span>Create New Student</span>
          </a>

          <a routerLink="/students/list" class="action-pill pill-blue">
            <app-icon name="users" [size]="15"></app-icon>
            <span>Student List</span>
          </a>

          <a routerLink="/setup/courses" class="action-pill pill-purple">
            <app-icon name="graduation-cap" [size]="15"></app-icon>
            <span>Course</span>
          </a>

          <a routerLink="/reports/fee-pending" class="action-pill pill-amber">
            <app-icon name="file-text" [size]="15"></app-icon>
            <span>Fees Pending Report</span>
          </a>
        </div>
      </div>

      <!-- 3. The 3 Contents Applied Using Video Chart Models & Animations -->
      <div class="middle-3-grid">
        <!-- CONTENT 1: Top In-Demand Courses -> Applied as the Layered Funnel Model -->
        <div class="panel-card anim-slide-1">
          <div class="panel-header header-between">
            <div class="panel-title">
              <app-icon name="filter" [size]="16" customClass="icon-purple"></app-icon>
              <div>
                <h3 class="panel-title-text">Course Demand Pipeline</h3>
              </div>
            </div>
            <span class="header-badge badge-purple-tint">{{ activeCoursesCount }} Courses</span>
          </div>

          <div class="funnel-container">
            <!-- SVG Layered Funnel Graphic -->
            <div class="funnel-svg-box">
              <svg viewBox="0 0 140 180" class="funnel-svg">
                <g *ngFor="let c of courseDemand; let i = index">
                  <polygon
                    [attr.points]="getFunnelPoints(i)"
                    [attr.fill]="c.color"
                    class="funnel-piece"
                    [class.is-hovered]="hoveredCourseIndex === i"
                    [class.is-dimmed]="hoveredCourseIndex !== null && hoveredCourseIndex !== i"
                    [style.animation-delay]="(i * 90) + 'ms'"
                    (mouseenter)="hoveredCourseIndex = i"
                    (mouseleave)="hoveredCourseIndex = null"
                  >
                    <title>{{ c.name }}: {{ c.count }} ({{ c.pct }}%)</title>
                  </polygon>
                </g>
              </svg>
            </div>

            <!-- Funnel Metric Breakdown on Right -->
            <div class="funnel-breakdown">
              <div
                class="funnel-item"
                *ngFor="let c of courseDemand; let i = index"
                [class.is-hovered]="hoveredCourseIndex === i"
                (mouseenter)="hoveredCourseIndex = i"
                (mouseleave)="hoveredCourseIndex = null"
              >
                <div class="f-item-info">
                  <span class="f-dot" [style.background-color]="c.color"></span>
                  <div>
                    <span class="f-count">{{ c.count }}</span>
                    <span class="f-name">{{ c.name }}</span>
                  </div>
                </div>
                <span class="f-pct" [ngClass]="'badge-' + (i % 5) + '-tint'">
                  {{ c.pct }}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- CONTENT 2: Branch Enrollment -> Applied as the Grouped Vertical Bar Chart Model -->
        <div class="panel-card anim-slide-2">
          <div class="panel-header header-between">
            <div class="panel-title">
              <app-icon name="bar-chart" [size]="16" customClass="icon-blue"></app-icon>
              <div>
                <h3 class="panel-title-text">Branch Enrollment</h3>
              </div>
            </div>

            <!-- Branch Quick Pills -->
            <div class="branch-count-tag">
              <span>{{ branchesList.length }} Centers</span>
            </div>
          </div>

          <!-- Vertical Bar Chart matching the Video's Monthly Performance Style -->
          <div class="branch-chart-wrap">
            <svg viewBox="0 0 540 210" class="branch-chart-svg" preserveAspectRatio="none">
              <!-- Grid lines -->
              <line x1="35" y1="30" x2="520" y2="30" stroke="#f1f5f9" stroke-dasharray="3 3" />
              <text x="22" y="34" class="axis-y">10</text>

              <line x1="35" y1="65" x2="520" y2="65" stroke="#f1f5f9" stroke-dasharray="3 3" />
              <text x="22" y="69" class="axis-y">8</text>

              <line x1="35" y1="100" x2="520" y2="100" stroke="#f1f5f9" stroke-dasharray="3 3" />
              <text x="22" y="104" class="axis-y">6</text>

              <line x1="35" y1="135" x2="520" y2="135" stroke="#f1f5f9" stroke-dasharray="3 3" />
              <text x="22" y="139" class="axis-y">4</text>

              <line x1="35" y1="170" x2="520" y2="170" stroke="#e2e8f0" stroke-width="1.5" />
              <text x="22" y="174" class="axis-y">0</text>

              <g
                *ngFor="let bar of branchChart; let i = index"
                [attr.transform]="'translate(' + (65 + i * 80) + ', 0)'"
                class="bar-group"
                [class.is-hovered]="hoveredBranchIndex === i"
                [class.is-dimmed]="hoveredBranchIndex !== null && hoveredBranchIndex !== i"
                (mouseenter)="hoveredBranchIndex = i"
                (mouseleave)="hoveredBranchIndex = null"
              >
                <title>{{ bar.label }}: {{ bar.count }} students</title>
                <text x="14" [attr.y]="170 - bar.height - 6" text-anchor="middle" class="bar-top-val">{{ bar.count }}</text>
                <rect
                  x="0"
                  [attr.y]="170 - bar.height"
                  width="28"
                  [attr.height]="bar.height"
                  rx="4"
                  [attr.fill]="bar.color"
                  class="anim-bar-rise"
                  [style.animation-delay]="(i * 90) + 'ms'"
                />
                <text x="14" y="192" text-anchor="middle" class="axis-x font-bold">{{ bar.label }}</text>
              </g>
            </svg>
          </div>
        </div>

        <!-- CONTENT 3: Fee Collection Split -> Applied as the Donut Chart Model -->
        <div class="panel-card anim-slide-3">
          <div class="panel-header header-between">
            <div class="panel-title">
              <app-icon name="pie-chart" [size]="16" customClass="icon-teal"></app-icon>
              <div>
                <h3 class="panel-title-text">Fee Collection Split</h3>
              </div>
            </div>
            <span class="header-badge badge-teal-tint">₹{{ feeCollected | number }} Total</span>
          </div>

          <div class="donut-wrapper">
            <div class="donut-box">
              <svg viewBox="0 0 160 160" class="donut-svg">
                <defs>
                  <mask id="donutDrawMask">
                    <circle
                      cx="80" cy="80" r="54"
                      fill="none"
                      stroke="#ffffff"
                      stroke-width="32"
                      stroke-dasharray="339.3"
                      stroke-dashoffset="339.3"
                      transform="rotate(-90 80 80)"
                      class="donut-mask-circle"
                    />
                  </mask>
                </defs>

                <!-- Base Track -->
                <circle cx="80" cy="80" r="54" fill="none" stroke="#f1f5f9" stroke-width="18" class="donut-track" />

                <!-- Progressive Clockwise Draw of Colored Slices -->
                <g mask="url(#donutDrawMask)">
                  <circle
                    *ngFor="let s of feeSplit; let i = index"
                    cx="80" cy="80" r="54"
                    fill="none"
                    [attr.stroke]="s.color"
                    [attr.stroke-width]="hoveredSplitIndex === i ? 23 : 18"
                    [attr.stroke-dasharray]="s.dashArray"
                    [attr.stroke-dashoffset]="s.dashOffset"
                    transform="rotate(-90 80 80)"
                    class="donut-slice"
                    [class.is-hovered]="hoveredSplitIndex === i"
                    [class.is-dimmed]="hoveredSplitIndex !== null && hoveredSplitIndex !== i"
                    (mouseenter)="hoveredSplitIndex = i"
                    (mouseleave)="hoveredSplitIndex = null"
                  >
                    <title>{{ s.name }}: ₹{{ s.amount }} ({{ s.pct }}%)</title>
                  </circle>
                </g>
              </svg>

              <div class="donut-center">
                <span class="donut-amount">₹{{ displayedRevenue | number }}</span>
                <span class="donut-label">Total Revenue</span>
              </div>
            </div>

            <div class="donut-legend">
              <div
                class="d-leg-row"
                *ngFor="let s of feeSplit; let i = index"
                [class.is-hovered]="hoveredSplitIndex === i"
                (mouseenter)="hoveredSplitIndex = i"
                (mouseleave)="hoveredSplitIndex = null"
              >
                <div class="d-leg-item">
                  <span class="d-dot" [style.background]="s.color"></span>
                  <span class="d-name">{{ s.name }}</span>
                </div>
                <div class="d-leg-val">
                  <strong>₹{{ s.amount | number }}</strong>
                  <span class="d-pct">({{ s.pct }}%)</span>
                </div>
              </div>
              <div class="d-leg-row" *ngIf="feeSplit.length === 0">
                <span class="d-name">No fee receipts</span>
              </div>
            </div>

            <div class="account-row-chips fee-type-chips">
              <div class="acc-chip" title="Total Fees Collected">
                <span class="acc-chip-name">Fees</span>
                <strong class="acc-chip-val">₹{{ feesTypeTotal | number }}</strong>
              </div>
              <div class="acc-chip" title="Total Book Amount Collected">
                <span class="acc-chip-name">Book Amount</span>
                <strong class="acc-chip-val">₹{{ bookAmountTotal | number }}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. Bottom Section: Operational Tables (Pending Follow-ups & Recent Fee Receipts) -->
      <div class="bottom-2-grid">
        <!-- Panel 1: Pending Follow-ups -->
        <div class="panel-card anim-slide-4">
          <div class="panel-header header-between">
            <div class="panel-title">
              <app-icon name="clock" [size]="16" customClass="icon-amber"></app-icon>
              <div>
                <h3 class="panel-title-text">Pending Follow ups</h3>
                
              </div>
            </div>

            <a routerLink="/students/list" class="view-all-link">View All</a>
          </div>

          <!-- Pending Follow-ups Table -->
          <div class="table-wrap">
            <table class="saas-table">
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
                <tr *ngFor="let row of pendingFollowUps" class="tr-hover">
                  <td>
                    <div class="student-cell">
                      <span
                        class="initial-avatar"
                        [style.background-color]="row.avatarBg"
                        [style.color]="row.avatarColor"
                      >{{ row.initials }}</span>
                      <span class="student-name">{{ row.name }}</span>
                    </div>
                  </td>
                  <td class="text-secondary">{{ row.note }}</td>
                  <td class="text-secondary">{{ row.mobile }}</td>
                  <td>
                    <span class="due-pill">{{ row.nextFollowUp }}</span>
                  </td>
                  <td style="text-align: right;">
                    <a routerLink="/students/follow-up" class="action-btn-pill">FollowUp</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Panel 2: Recent Fee Receipts -->
        <div class="panel-card anim-slide-5">
          <div class="panel-header header-between">
            <div class="panel-title">
              <app-icon name="receipt" [size]="16" customClass="icon-teal"></app-icon>
              <div>
                <h3 class="panel-title-text">Recent Fee Receipts</h3>
              </div>
            </div>

            <a routerLink="/reports/fee-receipt" class="view-all-link">View All</a>
          </div>

          <!-- Recent Receipts Table -->
          <div class="table-wrap">
            <table class="saas-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Course / Detail</th>
                  <th style="text-align: right;">Amount</th>
                  <th style="text-align: right;">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let rec of recentReceipts" class="tr-hover">
                  <td>
                    <span class="student-name">{{ rec.student }}</span>
                  </td>
                  <td class="text-secondary">{{ rec.type }}</td>
                  <td style="text-align: right;" class="amount-bold">₹{{ rec.amount | number }}</td>
                  <td style="text-align: right;" class="text-secondary">{{ rec.date }}</td>
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
      gap: 1.25rem;
      padding: 0.5rem 0.5rem 2.5rem 0.5rem;
      background-color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    /* 1. Top 5 Stats Row */
    .stats-row {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 0.95rem;
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
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 1rem 1.15rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 94px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .stat-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 24px -3px rgba(15, 23, 42, 0.08);
      border-color: #cbd5e1;
    }

    .stat-blue { background: #f0f7ff; border-color: #dbeafe; }
    .stat-purple { background: #faf5ff; border-color: #f3e8ff; }
    .stat-amber { background: #fffbeb; border-color: #fef3c7; }
    .stat-teal { background: #f0fdfa; border-color: #ccfbf1; }
    .stat-rose { background: #fff1f2; border-color: #ffe4e6; }

    .stat-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.65rem;
    }
    .stat-icon-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .icon-blue { color: #0284c7; }
    .icon-purple { color: #7c3aed; }
    .icon-amber { color: #d97706; }
    .icon-teal { color: #0d9488; }
    .icon-rose { color: #e11d48; }

    .stat-label {
      font-size: 0.78rem;
      font-weight: 600;
      color: #334155;
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

    .mini-chart {
      display: flex;
      align-items: flex-end;
      gap: 3px;
      height: 20px;
    }
    .mini-chart .bar {
      width: 3.5px;
      border-radius: 2px;
      transition: height 0.3s ease;
    }
    .mini-chart-blue .bar { background-color: #0284c7; }
    .mini-chart-purple .bar { background-color: #7c3aed; }
    .mini-chart-amber .bar { background-color: #d97706; }
    .mini-chart-teal .bar { background-color: #0d9488; }
    .mini-chart-rose .bar { background-color: #e11d48; }

    .b1 { height: 35%; }
    .b2 { height: 75%; }
    .b3 { height: 50%; }
    .b4 { height: 100%; }

    /* 2. Action Bar */
    .action-bar-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 0.85rem 1.35rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
    }

    .overview-title-group {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .overview-headline {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .overview-headline h2 {
      margin: 0;
      font-size: 1.15rem;
      font-weight: 700;
      color: #0f172a;
    }
    .live-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #22c55e;
      display: inline-block;
      animation: pulseGlow 2s infinite ease-in-out;
    }
    @keyframes pulseGlow {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.3); opacity: 0.7; }
    }
    .overview-date {
      font-size: 0.78rem;
      color: #64748b;
      font-weight: 500;
    }

    .quick-action-buttons {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .action-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.45rem 0.85rem;
      border-radius: 6px;
      font-size: 0.8125rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .action-pill:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
    }
    .pill-green { background-color: #16a34a; color: #ffffff; }
    .pill-blue { background-color: #0b62b6; color: #ffffff; }
    .pill-purple { background-color: #7c3aed; color: #ffffff; }
    .pill-amber { background-color: #d97706; color: #ffffff; }

    /* 3. Middle 3-Grid (The 3 Contents visualized as Video Models) */
    .middle-3-grid {
      display: grid;
      grid-template-columns: 1fr 1.6fr 1fr;
      gap: 1.15rem;
    }
    @media (max-width: 1200px) {
      .middle-3-grid {
        grid-template-columns: 1fr;
      }
    }

    .panel-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1.25rem 1.4rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      flex-direction: column;
    }
    .panel-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 28px -4px rgba(15, 23, 42, 0.08);
      border-color: #cbd5e1;
    }

    .panel-header {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 0.65rem;
      border-bottom: 1px solid #f8fafc;
    }
    .header-between {
      justify-content: space-between;
    }
    .panel-title {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }
    .panel-title-text {
      margin: 0;
      font-size: 0.95rem;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: -0.01em;
    }
    .panel-subtitle-text {
      font-size: 0.72rem;
      color: #64748b;
    }

    .header-badge {
      font-size: 0.72rem;
      font-weight: 700;
      padding: 0.2rem 0.55rem;
      border-radius: 6px;
    }
    .badge-purple-tint { background: #faf5ff; color: #7c3aed; border: 1px solid #f3e8ff; }
    .badge-teal-tint { background: #f0fdfa; color: #0d9488; border: 1px solid #ccfbf1; }
    .badge-blue-tint { background: #eff6ff; color: #0284c7; }
    .badge-green-tint { background: #f0fdf4; color: #16a34a; }
    .badge-orange-tint { background: #fffbeb; color: #d97706; }
    .badge-0-tint { background: #eff6ff; color: #0284c7; }
    .badge-1-tint { background: #f0fdfa; color: #0d9488; }
    .badge-2-tint { background: #f0fdf4; color: #16a34a; }
    .badge-3-tint { background: #fffbeb; color: #d97706; }
    .badge-4-tint { background: #faf5ff; color: #7c3aed; }

    /* CONTENT 1: Funnel Pipeline Layout */
    .funnel-container {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      flex: 1;
    }
    .funnel-svg-box {
      width: 105px;
      flex-shrink: 0;
    }
    .funnel-svg {
      width: 100%;
      height: 180px;
      overflow: visible;
    }
    .funnel-piece {
      transform-box: fill-box;
      transform-origin: center;
      opacity: 0;
      animation: funnelLayerIn 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.25s ease, opacity 0.25s ease;
      cursor: pointer;
    }
    .funnel-piece:hover,
    .funnel-piece.is-hovered {
      transform: scale(1.07);
      filter: brightness(1.1) drop-shadow(0 4px 10px rgba(15, 23, 42, 0.22));
    }
    .funnel-piece.is-dimmed {
      opacity: 0.45 !important;
    }
    @keyframes funnelLayerIn {
      from {
        opacity: 0;
        transform: translateY(-10px) scaleX(0.82);
      }
      to {
        opacity: 1;
        transform: translateY(0) scaleX(1);
      }
    }

    .funnel-breakdown {
      display: flex;
      flex-direction: column;
      gap: 0.55rem;
      flex: 1;
    }
    .funnel-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      padding: 0.25rem 0.4rem;
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 0.2s ease, transform 0.2s ease;
    }
    .funnel-item:hover,
    .funnel-item.is-hovered {
      background-color: #f8fafc;
      transform: translateX(4px);
    }
    .f-item-info {
      display: flex;
      align-items: center;
      gap: 0.55rem;
    }
    .f-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .dot-teal { background-color: #0d9488; }
    .dot-pink { background-color: #ec4899; }
    .dot-0 { background-color: #0284c7; }
    .dot-1 { background-color: #0d9488; }
    .dot-2 { background-color: #16a34a; }
    .dot-3 { background-color: #f59e0b; }
    .dot-4 { background-color: #ec4899; }

    .f-count {
      font-size: 0.9rem;
      font-weight: 700;
      color: #0f172a;
      display: block;
      line-height: 1.1;
    }
    .f-name {
      font-size: 0.72rem;
      color: #64748b;
    }
    .f-pct {
      font-size: 0.72rem;
      font-weight: 700;
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
      min-width: 38px;
      text-align: center;
    }

    /* CONTENT 2: Branch Vertical Bar Chart Layout */
    .branch-count-tag {
      font-size: 0.72rem;
      font-weight: 700;
      color: #0284c7;
      background: #eff6ff;
      border: 1px solid #dbeafe;
      padding: 0.2rem 0.55rem;
      border-radius: 6px;
    }
    .branch-chart-wrap {
      width: 100%;
      height: 200px;
    }
    .branch-chart-svg {
      width: 100%;
      height: 100%;
    }
    .axis-y {
      font-size: 11px;
      fill: #64748b;
      font-family: inherit;
    }
    .axis-x {
      font-size: 11px;
      fill: #334155;
      font-family: inherit;
    }
    .bar-top-val {
      font-size: 11px;
      font-weight: 700;
      fill: #0f172a;
      font-family: inherit;
      transition: transform 0.25s ease, fill 0.25s ease;
    }
    .bar-group {
      cursor: pointer;
      transition: opacity 0.25s ease;
    }
    .bar-group.is-dimmed {
      opacity: 0.45;
    }
    .bar-group:hover .bar-top-val,
    .bar-group.is-hovered .bar-top-val {
      transform: translateY(-4px);
      fill: #0284c7;
    }
    .bar-group:hover rect,
    .bar-group.is-hovered rect {
      transform: scaleY(1.06) scaleX(1.12);
      filter: brightness(1.12) drop-shadow(0 4px 10px rgba(15, 23, 42, 0.2));
    }
    .anim-bar-rise {
      transform-box: fill-box;
      transform-origin: bottom;
      opacity: 0;
      animation: barGrow 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.25s ease;
    }
    @keyframes barGrow {
      from {
        opacity: 0;
        transform: scaleY(0);
      }
      to {
        opacity: 1;
        transform: scaleY(1);
      }
    }

    /* CONTENT 3: Fee Split Donut Layout */
    .donut-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.85rem;
      flex: 1;
      justify-content: center;
    }
    .donut-box {
      position: relative;
      width: 196px;
      height: 196px;
    }
    .donut-svg {
      width: 100%;
      height: 100%;
      overflow: visible;
    }
    .donut-track {
      animation: trackFade 0.6s ease-out forwards;
    }
    @keyframes trackFade {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .donut-mask-circle {
      stroke-dasharray: 339.3;
      stroke-dashoffset: 339.3;
      animation: donutDrawAnim 1.35s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards;
    }
    @keyframes donutDrawAnim {
      0% {
        stroke-dashoffset: 339.3;
      }
      100% {
        stroke-dashoffset: 0;
      }
    }
    .donut-slice {
      transition: stroke-width 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease, filter 0.25s ease;
      cursor: pointer;
    }
    .donut-slice.is-hovered {
      stroke-opacity: 1;
      filter: drop-shadow(0 4px 10px rgba(15, 23, 42, 0.18));
    }
    .donut-slice.is-dimmed {
      opacity: 0.42;
    }
    .donut-center {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      animation: donutCenterPop 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
    }
    @keyframes donutCenterPop {
      0% {
        opacity: 0;
        transform: scale(0.8);
      }
      70% {
        opacity: 1;
        transform: scale(1.04);
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }
    .donut-amount {
      font-size: 1.45rem;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.1;
    }
    .donut-label {
      font-size: 0.72rem;
      color: #64748b;
      margin-top: 2px;
    }

    .donut-legend {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .d-leg-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.78rem;
      color: #475569;
      padding: 0.2rem 0.4rem;
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 0.2s ease, transform 0.2s ease;
    }
    .d-leg-row:hover,
    .d-leg-row.is-hovered {
      background-color: #f8fafc;
      transform: translateX(4px);
    }
    .donut-slice {
      cursor: pointer;
      transition: stroke-width 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease, filter 0.25s ease;
    }
    .donut-slice.is-hovered {
      filter: brightness(1.08) drop-shadow(0 3px 8px rgba(15, 23, 42, 0.22));
    }
    .donut-slice.is-dimmed {
      opacity: 0.4;
    }
    .d-leg-item {
      display: flex;
      align-items: center;
      gap: 0.45rem;
    }
    .d-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
    }
    .d-name {
      color: #334155;
    }
    .d-leg-val {
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }
    .d-leg-val strong {
      color: #0f172a;
    }
    .d-pct {
      font-size: 0.7rem;
      color: #64748b;
    }

    .account-row-chips {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.45rem;
      width: 100%;
      padding-top: 0.5rem;
      border-top: 1px dashed #e2e8f0;
    }
    .account-row-chips.fee-type-chips {
      grid-template-columns: repeat(2, 1fr);
    }
    .acc-chip {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 0.35rem 0.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: all 0.15s ease;
    }
    .acc-chip:hover {
      background: #eff6ff;
      border-color: #bfdbfe;
      transform: translateY(-2px);
      box-shadow: 0 4px 10px rgba(37, 99, 235, 0.08);
    }
    .acc-chip-name {
      font-size: 0.65rem;
      font-weight: 600;
      color: #64748b;
    }
    .acc-chip-val {
      font-size: 0.8125rem;
      font-weight: 700;
      color: #0f172a;
    }

    /* 4. Bottom 2-Grid */
    .bottom-2-grid {
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: 1.15rem;
    }
    @media (max-width: 1024px) {
      .bottom-2-grid {
        grid-template-columns: 1fr;
      }
    }

    .view-all-link {
      font-size: 0.75rem;
      font-weight: 600;
      color: #0284c7;
      text-decoration: none;
    }
    .view-all-link:hover {
      text-decoration: underline;
    }

    .saas-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.8125rem;
    }
    .saas-table th {
      text-align: left;
      font-weight: 600;
      color: #64748b;
      padding: 0.6rem 0.65rem;
      border-bottom: 1px solid #f1f5f9;
      font-size: 0.75rem;
    }
    .saas-table td {
      padding: 0.65rem 0.65rem;
      border-bottom: 1px solid #f8fafc;
      vertical-align: middle;
    }
    .tr-hover:hover {
      background-color: #f8fafc;
    }

    .student-cell {
      display: flex;
      align-items: center;
      gap: 0.55rem;
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
    .student-name {
      font-weight: 600;
      color: #0f172a;
    }
    .amount-bold {
      font-weight: 700;
      color: #0f172a;
    }
    .text-secondary {
      color: #64748b;
    }

    .due-pill {
      font-size: 0.72rem;
      font-weight: 600;
      color: #e11d48;
      background: #fff1f2;
      padding: 2px 6px;
      border-radius: 4px;
    }
    .action-btn-pill {
      font-size: 0.75rem;
      font-weight: 600;
      color: #0284c7;
      text-decoration: none;
      padding: 0.2rem 0.55rem;
      border-radius: 4px;
      background: #eff6ff;
    }
    .action-btn-pill:hover {
      background: #0284c7;
      color: #ffffff;
    }

    /* Staggered Animations */
    .anim-card-1 { animation: fadeIn 0.3s ease-out 0.03s both; }
    .anim-card-2 { animation: fadeIn 0.3s ease-out 0.06s both; }
    .anim-card-3 { animation: fadeIn 0.3s ease-out 0.09s both; }
    .anim-card-4 { animation: fadeIn 0.3s ease-out 0.12s both; }
    .anim-card-5 { animation: fadeIn 0.3s ease-out 0.15s both; }

    .anim-slide-1 { animation: fadeIn 0.4s ease-out 0.1s both; }
    .anim-slide-2 { animation: fadeIn 0.4s ease-out 0.15s both; }
    .anim-slide-3 { animation: fadeIn 0.4s ease-out 0.2s both; }
    .anim-slide-4 { animation: fadeIn 0.4s ease-out 0.25s both; }
    .anim-slide-5 { animation: fadeIn 0.4s ease-out 0.3s both; }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentDateStr = '';
  selectedBranch = 'All Branches';

  // Master lists
  allStudents: StudentListRow[] = [];
  allReceipts: Receipt[] = [];
  allFeePending: any[] = [];
  branchesList: BranchItem[] = [];
  accountsList: Account[] = [];
  coursesList: CourseItem[] = [];

  // Metrics
  totalStudents = 0;
  activeCoursesCount = 0;
  followUpsDueCount = 0;
  feeCollected = 0;
  feePending = 0;
  feeSplitTotal = 0;
  displayedRevenue = 0;
  feeSplit: FeeSplitItem[] = [];
  hoveredSplitIndex: number | null = null;
  hoveredBranchIndex: number | null = null;
  feesTypeTotal = 0;
  bookAmountTotal = 0;
  accountChips: AccountChip[] = [];
  branchChart: { label: string; count: number; color: string; height: number }[] = [];
  courseDemand: { name: string; count: number; color: string; pct: number }[] = [];
  hoveredCourseIndex: number | null = null;
  totalFunnelCount = 1;

  private readonly DONUT_CIRCUMFERENCE = 2 * Math.PI * 54;
  private readonly FEE_SPLIT_COLORS = ['#10b981', '#0284c7', '#f59e0b', '#8b5cf6', '#ec4899', '#0891b2'];

  // Tables
  pendingFollowUps: FollowUpRow[] = [];
  recentReceipts: FeeReceiptRow[] = [];

  constructor(private mockDataService: DataService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    const today = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    this.currentDateStr = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;

    // 1. Branches list
    this.mockDataService.getBranchItems().subscribe(branches => {
      this.branchesList = branches;
      this.applyBranchFilter();
      this.cdr.markForCheck();
    });

    // 2. Active Courses count
    this.mockDataService.getCourseItems().subscribe(courses => {
      this.coursesList = courses;
      this.activeCoursesCount = courses.length;
      this.buildCourseDemand();
      this.cdr.markForCheck();
    });

    // 3. Accounts list
    this.mockDataService.getAccounts().subscribe(accounts => {
      this.accountsList = accounts;
      this.applyBranchFilter();
      this.cdr.markForCheck();
    });

    // 4. Students
    this.mockDataService.getStudentListRows().subscribe(rows => {
      this.allStudents = rows;
      this.applyBranchFilter();
      this.cdr.markForCheck();
    });

    // 5. Receipts
    this.mockDataService.getReceipts().subscribe(receipts => {
      this.allReceipts = receipts;
      this.applyBranchFilter();
      this.cdr.markForCheck();
    });

    // 6. Fee Pending from Fee Pending Report
    this.mockDataService.getFeePendingEntries().subscribe(entries => {
      this.allFeePending = entries;
      this.applyBranchFilter();
      this.cdr.markForCheck();
    });
  }

  onBranchChange() {
    this.applyBranchFilter();
  }

  private applyBranchFilter() {
    const isAll = this.selectedBranch === 'All Branches';

    const filteredStudents = isAll
      ? this.allStudents
      : this.allStudents.filter(s => (s.branch || '') === this.selectedBranch);

    const studentsWithPendingFollowup = filteredStudents.filter(s => !!s.nextFollowUp && s.nextFollowUp.trim() !== '');
    this.totalStudents = filteredStudents.length;
    this.followUpsDueCount = studentsWithPendingFollowup.length;

    const chartColors = ['#0284c7', '#6366f1', '#10b981', '#f59e0b', '#ec4899', '#0891b2', '#7c3aed', '#db2777'];
    const maxCount = Math.max(1, ...this.branchesList.map(b => filteredStudents.filter(s => s.branch === b.name).length));
    this.branchChart = this.branchesList.slice(0, 8).map((b, i) => {
      const count = filteredStudents.filter(s => s.branch === b.name).length;
      return {
        label: b.name,
        count,
        color: chartColors[i % chartColors.length],
        height: Math.max(2, (count / maxCount) * 102)
      };
    });

    this.buildCourseDemand();

    const avatarPalettes = [
      { bg: '#eff6ff', color: '#0284c7' },
      { bg: '#f0fdf4', color: '#16a34a' },
      { bg: '#faf5ff', color: '#7c3aed' },
      { bg: '#fefce8', color: '#b45309' }
    ];

    const displayList = studentsWithPendingFollowup.length > 0 ? studentsWithPendingFollowup : filteredStudents;

    this.pendingFollowUps = displayList.slice(0, 4).map((r, i) => {
      const parts = r.name.trim().split(/\s+/);
      const initials = parts.length > 1
        ? (parts[0][0] + parts[1][0]).toUpperCase()
        : parts[0].substring(0, 2).toUpperCase();
      return {
        initials,
        avatarBg: avatarPalettes[i % avatarPalettes.length].bg,
        avatarColor: avatarPalettes[i % avatarPalettes.length].color,
        name: r.name,
        note: r.note,
        mobile: r.mobile,
        nextFollowUp: r.nextFollowUp || '-'
      };
    });

    const filteredReceipts = isAll
      ? this.allReceipts
      : this.allReceipts.filter(r => (r.branch || '') === this.selectedBranch);

    const filteredPending = isAll
      ? this.allFeePending
      : this.allFeePending.filter(e => (e.branch || '') === this.selectedBranch);

    this.feeCollected = filteredReceipts.reduce((sum, r) => sum + (r.amount || 0), 0);
    this.feePending = filteredPending.reduce((sum, e) => sum + (e.balanceAmount || 0), 0);
    this.buildFeeSplit(filteredReceipts);
    this.buildAccountChips(isAll ? this.accountsList : this.accountsList.filter(a => (a.branch || '') === this.selectedBranch));

    this.recentReceipts = filteredReceipts.slice(0, 4).map(r => ({
      student: r.studentName || r.from || '',
      type: r.details || r.course || r.toAccount || '',
      amount: r.amount,
      date: r.date
    }));
  }

  private paymentCategory(mode: string): string {
    const value = (mode || '').trim().toLowerCase();
    if (!value) return 'CASH';
    if (value.includes('upi') || value.includes('online')) return 'UPI';
    if (value.includes('bank') || value.includes('neft') || value.includes('rtgs') || value.includes('imps')) return 'BANK';
    if (value.includes('cash')) return 'CASH';
    return mode.trim().toUpperCase();
  }

  private buildFeeSplit(receipts: Receipt[]): void {
    const modeOrder = ['CASH', 'BANK', 'UPI'];
    const totals = new Map<string, number>();
    modeOrder.forEach(m => totals.set(m, 0));

    let feesSum = 0;
    let bookSum = 0;

    receipts.forEach(r => {
      const amt = Number(r.amount) || 0;
      const accountOrMode = r.toAccount || r.paymentMode || '';
      const cat = this.paymentCategory(accountOrMode);
      const bucket = modeOrder.includes(cat) ? cat : 'CASH';
      totals.set(bucket, (totals.get(bucket) || 0) + amt);

      const feeType = (r.paymentMode || '').trim().toLowerCase();
      if (feeType.includes('book')) {
        bookSum += amt;
      } else {
        feesSum += amt;
      }
    });

    this.feesTypeTotal = feesSum;
    this.bookAmountTotal = bookSum;

    const entries = Array.from(totals.entries())
      .filter(([, amount]) => amount > 0);

    this.feeSplitTotal = entries.reduce((sum, [, amount]) => sum + amount, 0);
    this.animateRevenue(this.feeSplitTotal);
    let used = 0;

    this.feeSplit = entries.map(([name, amount], i) => {
      const length = (amount / this.feeSplitTotal) * this.DONUT_CIRCUMFERENCE;
      const item: FeeSplitItem = {
        name,
        amount,
        pct: Math.round((amount / this.feeSplitTotal) * 100),
        color: this.FEE_SPLIT_COLORS[i % this.FEE_SPLIT_COLORS.length],
        dashArray: `${length} ${this.DONUT_CIRCUMFERENCE}`,
        dashOffset: -used
      };
      used += length;
      return item;
    });
  }

  private animateRevenue(target: number): void {
    if (target <= 0) {
      this.displayedRevenue = 0;
      return;
    }
    const start = 0;
    const duration = 1200;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      this.displayedRevenue = Math.round(start + (target - start) * ease);
      this.cdr.markForCheck();
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        this.displayedRevenue = target;
        this.cdr.markForCheck();
      }
    };
    requestAnimationFrame(step);
  }

  private buildAccountChips(accounts: Account[]): void {
    this.accountChips = accounts.map(a => ({
      name: a.name || a.code || 'Account',
      balance: Number(a.currentBalance) || 0,
      title: a.name || a.code || 'Account'
    }));
  }

  private buildCourseDemand() {
    const funnelColors = ['#0284c7', '#0d9488', '#16a34a', '#f59e0b', '#ec4899', '#0891b2', '#7c3aed'];
    const total = Math.max(1, this.allStudents.length);
    this.courseDemand = this.coursesList.map((c, i) => {
      const count = this.allStudents.filter(s => s.note === c.name).length;
      return {
        name: c.name,
        count,
        color: funnelColors[i % funnelColors.length],
        pct: total ? Math.round((count / total) * 100) : 0
      };
    });
    this.totalFunnelCount = total;
  }

  getFunnelPoints(i: number): string {
    const n = Math.max(1, this.courseDemand.length);
    const totalHeight = 176;
    const gap = 4;
    const layerH = Math.max(14, (totalHeight - gap * (n - 1)) / n);
    const y1 = i * (layerH + gap);
    const y2 = y1 + layerH;
    const topInset = 8 + (i / n) * 42;
    const bottomInset = 8 + ((i + 1) / n) * 42;
    return `${topInset},${y1} ${140 - topInset},${y1} ${140 - bottomInset},${y2} ${bottomInset},${y2}`;
  }
}
