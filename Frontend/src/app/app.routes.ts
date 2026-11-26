import { Routes } from '@angular/router';
import { LayoutComponent } from './core/layout.component';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },

      // 1. Students
      {
        path: 'students/create',
        loadComponent: () => import('./features/students/student-create.component').then(m => m.StudentCreateComponent)
      },
      {
        path: 'students/list',
        loadComponent: () => import('./features/students/student-list.component').then(m => m.StudentListComponent)
      },
      {
        path: 'students/follow-up',
        loadComponent: () => import('./features/students/student-followup.component').then(m => m.StudentFollowupComponent)
      },
      {
        path: 'students/detail/:name',
        loadComponent: () => import('./features/students/student-detail.component').then(m => m.StudentDetailComponent)
      },

      // 2. Accounts
      {
        path: 'accounts',
        loadComponent: () => import('./features/accounts/accounts.component').then(m => m.AccountsComponent)
      },

      // 3. Receipts
      {
        path: 'receipts',
        loadComponent: () => import('./features/receipts/receipts.component').then(m => m.ReceiptsComponent)
      },

      // 4. Reports (The 2 wanted reports)
      {
        path: 'reports/fee-receipt',
        loadComponent: () => import('./features/reports/fee-receipt-report.component').then(m => m.FeeReceiptReportComponent)
      },
      {
        path: 'reports/fee-pending',
        loadComponent: () => import('./features/reports/fee-pending-report.component').then(m => m.FeePendingReportComponent)
      },

      // 5. Settings
      {
        path: 'setup/courses',
        loadComponent: () => import('./features/settings/course-setup.component').then(m => m.CourseSetupComponent)
      },
      {
        path: 'setup/roles',
        loadComponent: () => import('./features/settings/user-roles.component').then(m => m.UserRolesComponent)
      },
      {
        path: 'setup/users/list',
        loadComponent: () => import('./features/settings/user-details.component').then(m => m.UserDetailsComponent)
      },
      {
        path: 'settings/followup-types',
        loadComponent: () => import('./features/settings/followup-types.component').then(m => m.FollowupTypesComponent)
      },
      {
        path: 'settings/enquiry-sources',
        loadComponent: () => import('./features/settings/enquiry-sources.component').then(m => m.EnquirySourcesComponent)
      },
      {
        path: 'settings/status-list',
        loadComponent: () => import('./features/settings/status-settings.component').then(m => m.StatusSettingsComponent)
      },
      {
        path: 'departments/list',
        loadComponent: () => import('./features/settings/departments.component').then(m => m.DepartmentsComponent)
      },
      {
        path: 'branches/list',
        loadComponent: () => import('./features/settings/branches.component').then(m => m.BranchesComponent)
      },
      {
        path: 'company-info',
        loadComponent: () => import('./features/settings/company-info.component').then(m => m.CompanyInfoComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
