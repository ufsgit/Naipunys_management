import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { DataService } from '../../core/data.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-page">
      <div class="login-card">
        <div class="login-brand">
          <span class="brand-mark">N</span>
          <div>
            <h1>Naipunya</h1>
            <p>Management System</p>
          </div>
        </div>

        <h2>Sign in</h2>
        <p class="sub">Use your admin credentials to continue</p>

        <form (ngSubmit)="submit()" #loginForm="ngForm">
          <label>Username</label>
          <input type="text" name="username" [(ngModel)]="username" autocomplete="username" required placeholder="admin" />

          <label>Password</label>
          <input type="password" name="password" [(ngModel)]="password" autocomplete="current-password" required placeholder="admin123" />

          <div class="error" *ngIf="errorMessage">{{ errorMessage }}</div>

          <button type="submit" [disabled]="loading || loginForm.invalid">
            {{ loading ? 'Signing in…' : 'Sign in' }}
          </button>
        </form>

        <p class="hint">Demo: <b>admin</b> / <b>admin123</b></p>
      </div>
    </div>
  `,
  styles: [`
    .login-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #eef4ff, #f8fafc); font-family: inherit; }
    .login-card { width: 380px; max-width: calc(100vw - 32px); background: #fff; border: 1px solid #e5e9f0; border-radius: 14px; padding: 32px; box-shadow: 0 18px 50px rgba(15, 23, 42, .10); }
    .login-brand { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
    .brand-mark { width: 42px; height: 42px; border-radius: 11px; background: #2563eb; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 700; }
    .login-brand h1 { margin: 0; font-size: 20px; color: #0f172a; }
    .login-brand p { margin: 2px 0 0; font-size: 12px; color: #64748b; }
    h2 { margin: 0 0 4px; font-size: 22px; color: #0f172a; }
    .sub { margin: 0 0 22px; font-size: 13px; color: #64748b; }
    label { display: block; font-size: 12px; font-weight: 600; color: #334155; margin-bottom: 6px; }
    input { width: 100%; box-sizing: border-box; padding: 10px 12px; border: 1px solid #d7dde8; border-radius: 8px; font-size: 14px; margin-bottom: 16px; outline: none; }
    input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,.12); }
    button { width: 100%; padding: 11px; border: 0; border-radius: 8px; background: #2563eb; color: #fff; font-size: 14px; font-weight: 600; cursor: pointer; }
    button:disabled { opacity: .6; cursor: default; }
    .error { color: #dc2626; font-size: 12px; margin: -6px 0 12px; }
    .hint { margin: 18px 0 0; text-align: center; font-size: 12px; color: #94a3b8; }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  loading = false;
  errorMessage = '';

  constructor(private auth: AuthService, private data: DataService, private router: Router) {}

  submit(): void {
    this.errorMessage = '';
    this.loading = true;
    this.auth.login(this.username, this.password).subscribe({
      next: response => {
        if (response?.success && response.data?.token) {
          this.data.preload().subscribe(() => {
            this.loading = false;
            this.router.navigate(['/dashboard']);
          });
        } else {
          this.loading = false;
          this.errorMessage = 'Invalid username or password';
        }
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Cannot reach the backend. Make sure it is running on port 5000.';
      }
    });
  }
}
