import { IconComponent } from '../../shared/index';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MockDataService, StudentListRow, Receipt, CourseItem, BranchItem, Account } from '../../core/mock-data.service';

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
                <span class="panel-subtitle-text">Student enrollment distribution</span>
              </div>
            </div>
            <span class="header-badge badge-purple-tint">{{ activeCoursesCount }} Courses</span>
          </div>

          <div class="funnel-container">
            <!-- SVG Layered Funnel Graphic matching Video -->
            <div class="funnel-svg-box">
              <svg viewBox="0 0 140 180" class="funnel-svg">
                <!-- Layer 1: IELTS Regular (7 students • 47%) -->
                <polygon
                  points="10,0 130,0 120,32 20,32"
                  class="funnel-piece fp-blue"
                />
                <!-- Layer 2: German Language (3 students • 20%) -->
                <polygon
                  points="21,36 119,36 111,68 29,68"
                  class="funnel-piece fp-teal"
                />
                <!-- Layer 3: UK / NZ Visa (3 students • 20%) -->
                <polygon
                  points="30,72 110,72 103,104 37,104"
                  class="funnel-piece fp-green"
                />
                <!-- Layer 4: IELTS Crash (2 students • 13%) -->
                <polygon
                  points="38,108 102,108 95,140 45,140"
                  class="funnel-piece fp-orange"
                />
                <!-- Layer 5: Other Courses / Inactive -->
                <polygon
                  points="46,144 94,144 88,176 52,176"
                  class="funnel-piece fp-pink"
                />
              </svg>
            </div>

            <!-- Funnel Metric Breakdown on Right -->
            <div class="funnel-breakdown">
              <div class="funnel-item">
                <div class="f-item-info">
                  <span class="f-dot dot-blue"></span>
                  <div>
                    <span class="f-count">7</span>
                    <span class="f-name">IELTS 1 Month / Regular</span>
                  </div>
                </div>
                <span class="f-pct badge-blue-tint">47%</span>
              </div>

              <div class="funnel-item">
                <div class="f-item-info">
                  <span class="f-dot dot-teal"></span>
                  <div>
                    <span class="f-count">3</span>
                    <span class="f-name">German Language & Visa</span>
                  </div>
                </div>
                <span class="f-pct badge-teal-tint">20%</span>
              </div>

              <div class="funnel-item">
                <div class="f-item-info">
                  <span class="f-dot dot-green"></span>
                  <div>
                    <span class="f-count">3</span>
                    <span class="f-name">UK / NZ Dependent Visa</span>
                  </div>
                </div>
                <span class="f-pct badge-green-tint">20%</span>
              </div>

              <div class="funnel-item">
                <div class="f-item-info">
                  <span class="f-dot dot-orange"></span>
                  <div>
                    <span class="f-count">2</span>
                    <span class="f-name">IELTS 2 Months / Crash</span>
                  </div>
                </div>
                <span class="f-pct badge-orange-tint">13%</span>
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
                <span class="panel-subtitle-text">Active students across centers</span>
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

              <!-- Ernakulam (7 students • Highest bar) -->
              <g transform="translate(65, 0)" class="bar-group">
                <text x="14" y="62" text-anchor="middle" class="bar-top-val">7</text>
                <rect x="0" y="68" width="28" height="102" rx="4" fill="#0284c7" class="anim-bar-rise" />
                <text x="14" y="192" text-anchor="middle" class="axis-x font-bold">Ernakulam</text>
              </g>

              <!-- Kaloor (3 students) -->
              <g transform="translate(145, 0)" class="bar-group">
                <text x="14" y="120" text-anchor="middle" class="bar-top-val">3</text>
                <rect x="0" y="126" width="28" height="44" rx="4" fill="#6366f1" class="anim-bar-rise" />
                <text x="14" y="192" text-anchor="middle" class="axis-x font-bold">Kaloor</text>
              </g>

              <!-- Angamaly (2 students) -->
              <g transform="translate(225, 0)" class="bar-group">
                <text x="14" y="135" text-anchor="middle" class="bar-top-val">2</text>
                <rect x="0" y="141" width="28" height="29" rx="4" fill="#10b981" class="anim-bar-rise" />
                <text x="14" y="192" text-anchor="middle" class="axis-x font-bold">Angamaly</text>
              </g>

              <!-- Thrikkakara (2 students) -->
              <g transform="translate(305, 0)" class="bar-group">
                <text x="14" y="135" text-anchor="middle" class="bar-top-val">2</text>
                <rect x="0" y="141" width="28" height="29" rx="4" fill="#f59e0b" class="anim-bar-rise" />
                <text x="14" y="192" text-anchor="middle" class="axis-x font-bold">Thrikkakara</text>
              </g>

              <!-- Pala (1 student) -->
              <g transform="translate(385, 0)" class="bar-group">
                <text x="14" y="150" text-anchor="middle" class="bar-top-val">1</text>
                <rect x="0" y="156" width="28" height="14" rx="4" fill="#ec4899" class="anim-bar-rise" />
                <text x="14" y="192" text-anchor="middle" class="axis-x font-bold">Pala</text>
              </g>

              <!-- Overseas (0 students) -->
              <g transform="translate(465, 0)" class="bar-group">
                <text x="14" y="164" text-anchor="middle" class="bar-top-val">0</text>
                <rect x="0" y="168" width="28" height="2" rx="1" fill="#cbd5e1" />
                <text x="14" y="192" text-anchor="middle" class="axis-x">Overseas</text>
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
                <span class="panel-subtitle-text">Revenue & payment modes</span>
              </div>
            </div>
            <span class="header-badge badge-teal-tint">₹{{ feeCollected | number }} Total</span>
          </div>

          <div class="donut-wrapper">
            <!-- Donut SVG with Total in Center matching Video -->
            <div class="donut-box">
              <svg viewBox="0 0 160 160" class="donut-svg">
                <!-- Track background -->
                <circle cx="80" cy="80" r="54" fill="none" stroke="#f1f5f9" stroke-width="18" />

                <!-- UPI (₹9,000 • 47%) -> Circ = 340 -> 47% = 160 -->
                <circle
                  cx="80" cy="80" r="54"
                  fill="none"
                  stroke="#10b981"
                  stroke-width="18"
                  stroke-dasharray="160 340"
                  stroke-dashoffset="0"
                  transform="rotate(-90 80 80)"
                  class="anim-donut-draw"
                />

                <!-- Bank Transfer (₹5,000 • 26.5%) -> 26.5% = 90 -->
                <circle
                  cx="80" cy="80" r="54"
                  fill="none"
                  stroke="#0284c7"
                  stroke-width="18"
                  stroke-dasharray="90 340"
                  stroke-dashoffset="-160"
                  transform="rotate(-90 80 80)"
                  class="anim-donut-draw"
                />

                <!-- Cash in Hand (₹5,000 • 26.5%) -> 26.5% = 90 -->
                <circle
                  cx="80" cy="80" r="54"
                  fill="none"
                  stroke="#f59e0b"
                  stroke-width="18"
                  stroke-dasharray="90 340"
                  stroke-dashoffset="-250"
                  transform="rotate(-90 80 80)"
                  class="anim-donut-draw"
                />
              </svg>

              <!-- Center Total Number matching Video -->
              <div class="donut-center">
                <span class="donut-amount">₹19K</span>
                <span class="donut-label">Total Revenue</span>
              </div>
            </div>

            <!-- Legend with Exact Amounts & Pct below Donut -->
            <div class="donut-legend">
              <div class="d-leg-row">
                <div class="d-leg-item">
                  <span class="d-dot dot-green"></span>
                  <span class="d-name">UPI / Online</span>
                </div>
                <div class="d-leg-val">
                  <strong>₹9,000</strong>
                  <span class="d-pct">(47%)</span>
                </div>
              </div>

              <div class="d-leg-row">
                <div class="d-leg-item">
                  <span class="d-dot dot-blue"></span>
                  <span class="d-name">Bank Transfer</span>
                </div>
                <div class="d-leg-val">
                  <strong>₹5,000</strong>
                  <span class="d-pct">(26%)</span>
                </div>
              </div>

              <div class="d-leg-row">
                <div class="d-leg-item">
                  <span class="d-dot dot-orange"></span>
                  <span class="d-name">Cash in Hand</span>
                </div>
                <div class="d-leg-val">
                  <strong>₹5,000</strong>
                  <span class="d-pct">(26%)</span>
                </div>
              </div>
            </div>

            <!-- Account Balances Micro-chips -->
            <div class="account-row-chips">
              <div class="acc-chip" title="Cash Petty Balance">
                <span class="acc-chip-name">Cash</span>
                <strong class="acc-chip-val">₹25K</strong>
              </div>
              <div class="acc-chip" title="HDFC Main Operating A/C">
                <span class="acc-chip-name">HDFC</span>
                <strong class="acc-chip-val">₹180K</strong>
              </div>
              <div class="acc-chip" title="SBI Fee Collection">
                <span class="acc-chip-name">SBI</span>
                <strong class="acc-chip-val">₹250K</strong>
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
                <span class="panel-subtitle-text">Scheduled student communications</span>
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
                <span class="panel-subtitle-text">Latest financial inflows</span>
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
    }
    .funnel-piece {
      transition: all 0.2s ease;
      cursor: pointer;
    }
    .funnel-piece:hover {
      opacity: 0.85;
      filter: drop-shadow(0 2px 5px rgba(0,0,0,0.2));
    }
    .fp-blue { fill: #0284c7; }
    .fp-teal { fill: #0d9488; }
    .fp-green { fill: #16a34a; }
    .fp-orange { fill: #f59e0b; }
    .fp-pink { fill: #ec4899; }

    .funnel-breakdown {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      flex: 1;
    }
    .funnel-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
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
    .dot-blue { background-color: #0284c7; }
    .dot-teal { background-color: #0d9488; }
    .dot-green { background-color: #16a34a; }
    .dot-orange { background-color: #f59e0b; }
    .dot-pink { background-color: #ec4899; }

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
    }
    .bar-group {
      cursor: pointer;
      transition: transform 0.2s ease;
    }
    .bar-group:hover rect {
      filter: brightness(1.1);
    }
    .anim-bar-rise {
      transform-origin: bottom;
      animation: barGrow 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes barGrow {
      from { transform: scaleY(0); }
      to { transform: scaleY(1); }
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
      width: 135px;
      height: 135px;
    }
    .donut-svg {
      width: 100%;
      height: 100%;
    }
    .anim-donut-draw {
      animation: donutAnim 1.2s ease-out forwards;
    }
    @keyframes donutAnim {
      from { stroke-dashoffset: 340; }
    }
    .donut-center {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .donut-amount {
      font-size: 1.25rem;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.1;
    }
    .donut-label {
      font-size: 0.68rem;
      color: #64748b;
      margin-top: 1px;
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
  branchesList: BranchItem[] = [];
  accountsList: Account[] = [];

  // Metrics
  totalStudents = 15;
  activeCoursesCount = 8;
  followUpsDueCount = 8;
  feeCollected = 19000;
  feePending = 38500;

  // Tables
  pendingFollowUps: FollowUpRow[] = [];
  recentReceipts: FeeReceiptRow[] = [];

  constructor(private mockDataService: MockDataService) {}

  ngOnInit() {
    const today = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    this.currentDateStr = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;

    // 1. Branches list
    this.mockDataService.getBranchItems().subscribe(branches => {
      this.branchesList = branches;
    });

    // 2. Active Courses count
    this.mockDataService.getCourseItems().subscribe(courses => {
      this.activeCoursesCount = courses.length;
    });

    // 3. Accounts list
    this.mockDataService.getAccounts().subscribe(accounts => {
      this.accountsList = accounts;
    });

    // 4. Students
    this.mockDataService.getStudentListRows().subscribe(rows => {
      this.allStudents = rows;
      this.applyBranchFilter();
    });

    // 5. Receipts
    this.mockDataService.getReceipts().subscribe(receipts => {
      this.allReceipts = receipts;
      this.applyBranchFilter();
    });

    // 6. Fee Pending from Fee Pending Report
    this.mockDataService.getFeePendingEntries().subscribe(entries => {
      this.feePending = entries.reduce((sum, e) => sum + (e.balanceAmount || 0), 0);
    });
  }

  onBranchChange() {
    this.applyBranchFilter();
  }

  private applyBranchFilter() {
    const isAll = this.selectedBranch === 'All Branches';

    const filteredStudents = isAll
      ? this.allStudents
      : this.allStudents.filter(s => (s.branch || 'Ernakulam') === this.selectedBranch);

    this.totalStudents = filteredStudents.length;
    this.followUpsDueCount = filteredStudents.filter(s => !!s.nextFollowUp).length;

    const avatarPalettes = [
      { bg: '#eff6ff', color: '#0284c7' },
      { bg: '#f0fdf4', color: '#16a34a' },
      { bg: '#faf5ff', color: '#7c3aed' },
      { bg: '#fefce8', color: '#b45309' }
    ];

    this.pendingFollowUps = filteredStudents.slice(0, 4).map((r, i) => {
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
        nextFollowUp: r.nextFollowUp
      };
    });

    const filteredReceipts = isAll
      ? this.allReceipts
      : this.allReceipts.filter(r => (r.branch || 'Ernakulam') === this.selectedBranch);

    this.feeCollected = filteredReceipts.reduce((sum, r) => sum + (r.amount || 0), 0);

    this.recentReceipts = filteredReceipts.slice(0, 4).map(r => ({
      student: r.studentName,
      type: r.details || r.course,
      amount: r.amount,
      date: r.date
    }));
  }
}
