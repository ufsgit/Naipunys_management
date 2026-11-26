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
      <!-- Left: Clean White Sign-In Panel -->
      <section class="form-panel">
        <div class="form-shell" [class.has-error]="!!errorMessage">
          <!-- Brand Logo -->
          <div class="brand-row">
            <div class="brand-icon" aria-hidden="true">
              <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="url(#brandGrad)" />
                <path d="M18.5 7.5C18.5 12.2 21.8 15.5 26.5 15.5C21.8 15.5 18.5 18.8 18.5 23.5C18.5 18.8 15.2 15.5 10.5 15.5C15.2 15.5 18.5 12.2 18.5 7.5Z" fill="#ffffff"/>
                <path d="M9 9.5C12.5 9.5 14.5 11.5 14.5 14.5C11.5 14.5 9 12.5 9 9.5Z" fill="rgba(255,255,255,0.65)"/>
                <defs>
                  <linearGradient id="brandGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#a855f7" />
                    <stop offset="100%" stop-color="#6d28d9" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span class="brand-wordmark">NAIPU<span>NYA</span></span>
          </div>

          <h1 class="form-title">Sign In to Naipunya</h1>

          

          <div class="divider">
            <span>or</span>
          </div>

          <!-- Login Form -->
          <form (ngSubmit)="submit()" #loginForm="ngForm">
            <!-- Username Outlined Floating-Label Input -->
            <div class="outlined-field" [class.is-focused]="focusedField === 'username'" [class.has-value]="!!username">
              <span class="field-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </span>
              <label for="username" class="floating-label">User Name</label>
              <input
                id="username"
                type="text"
                name="username"
                [(ngModel)]="username"
                (focus)="focusedField = 'username'"
                (blur)="focusedField = 'none'"
                autocomplete="username"
                required />
            </div>

            <!-- Password Outlined Floating-Label Input -->
            <div class="outlined-field" [class.is-focused]="focusedField === 'password'" [class.has-value]="!!password">
              <span class="field-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </span>
              <label for="password" class="floating-label">Password</label>
              <input
                id="password"
                [type]="showPassword ? 'text' : 'password'"
                name="password"
                [(ngModel)]="password"
                (focus)="focusedField = 'password'"
                (blur)="focusedField = 'none'"
                autocomplete="current-password"
                required />
              <button
                type="button"
                class="pw-toggle"
                (click)="showPassword = !showPassword"
                [attr.aria-label]="showPassword ? 'Hide password' : 'Show password'">
                <svg *ngIf="!showPassword" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <svg *ngIf="showPassword" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"></path>
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              </button>
            </div>

            

            <div class="info-msg" *ngIf="infoMessage">{{ infoMessage }}</div>
            <div class="error-msg" *ngIf="errorMessage">{{ errorMessage }}</div>

            <button
              type="submit"
              class="login-submit"
              [class.is-ready]="loginForm.valid && !loading"
              [disabled]="loading || loginForm.invalid">
              <span class="btn-spinner" *ngIf="loading"></span>
              <span>{{ loading ? 'Signing in…' : 'Login' }}</span>
            </button>

           
          </form>

         
        </div>

        <!-- Bottom-left language indicator -->
        
      </section>

      <!-- Right: Diagonal Lavender-Violet Showcase with Visible Animations -->
      <section class="visual-panel" aria-hidden="true">
        <div class="diagonal-surface">
          <!-- Animated Orbit Rings Behind Character -->
          <div class="orbit-ring orbit-1"></div>
          <div class="orbit-ring orbit-2"></div>

          <!-- Rising Light Particles -->
          <span class="spark-dot dot-1"></span>
          <span class="spark-dot dot-2"></span>
          <span class="spark-dot dot-3"></span>
          <span class="spark-dot dot-4"></span>
          <span class="spark-dot dot-5"></span>

          <!-- Floating 3D Glass Icon Orbs (Text-free) -->
          <div class="glass-orb orb-cap">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
              <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
            </svg>
          </div>

          <div class="glass-orb orb-book">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
          </div>

          <div class="glass-orb orb-star">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </div>

          <div class="glass-orb orb-spark">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffffff">
              <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
            </svg>
          </div>

          <!-- Floating 3D Glass Shapes -->
          <div class="glass-shape shape-1"></div>
          <div class="glass-shape shape-2"></div>

          <!-- 3D Stylized Student Character -->
          <div class="student-stage">
            <img
              src="/login-student.jpg"
              alt="Student"
              class="student-img" />
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .login-page {
      min-height: 100vh;
      width: 100%;
      display: grid;
      grid-template-columns: 0.92fr 1.08fr;
      background: #ffffff;
      overflow: hidden;
      font-family: inherit;
    }

    /* Left White Form Panel */
    .form-panel {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 36px;
      background: #ffffff;
      z-index: 2;
    }

    .form-shell {
      width: 100%;
      max-width: 430px;
      animation: formEnter 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }

    .form-shell.has-error {
      animation: shakeForm 0.36s ease-in-out;
    }

    .brand-row {
      display: flex;
      align-items: center;
      gap: 11px;
      margin-bottom: 26px;
    }

    .brand-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      transform: scale(1.15);
    }

    .brand-wordmark {
      font-size: 19px;
      font-weight: 800;
      letter-spacing: 0.14em;
      color: #1e1b4b;
    }

    .brand-wordmark span {
      color: #7c3aed;
    }

    .form-title {
      margin: 0 0 24px;
      font-size: 24px;
      font-weight: 700;
      color: #1e1b4b;
      letter-spacing: -0.015em;
    }

    /* Social Quick Buttons */
    .social-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 18px;
    }

    .social-btn {
      height: 38px;
      border: 1px solid #f1f5f9;
      border-radius: 9px;
      background: #f4f4f6;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background-color 0.18s ease, transform 0.15s ease, border-color 0.18s ease;
    }

    .social-btn:hover {
      background: #ececf1;
      border-color: #e2e8f0;
      transform: translateY(-1px);
    }

    .divider {
      position: relative;
      text-align: center;
      margin: 0 0 20px;
    }

    .divider::before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 50%;
      height: 1px;
      background: #e5e7eb;
    }

    .divider span {
      position: relative;
      background: #ffffff;
      padding: 0 12px;
      font-size: 11px;
      color: #9ca3af;
    }

    /* Fluid Outlined Floating-Label Inputs */
    .outlined-field {
      position: relative;
      display: flex;
      align-items: center;
      height: 52px;
      border: 1.5px solid #cbd5e1;
      border-radius: 14px;
      background: #f8fafc;
      margin-bottom: 20px;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.03);
      transition: border-color 0.25s cubic-bezier(0.22, 1, 0.36, 1),
                  background-color 0.25s cubic-bezier(0.22, 1, 0.36, 1),
                  box-shadow 0.25s cubic-bezier(0.22, 1, 0.36, 1),
                  transform 0.2s cubic-bezier(0.22, 1, 0.36, 1);
    }

    .outlined-field:hover {
      border-color: #a78bfa;
      background: #ffffff;
    }

    .outlined-field.is-focused {
      border-color: #6d28d9;
      background: #ffffff;
      box-shadow: 0 8px 22px rgba(109, 40, 217, 0.12), 0 0 0 3.5px rgba(124, 58, 237, 0.12);
      transform: translateY(-1px);
    }

    .field-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      color: #64748b;
      flex-shrink: 0;
      transition: color 0.2s ease;
    }

    .outlined-field.is-focused .field-icon {
      color: #6d28d9;
    }

    .floating-label {
      position: absolute;
      left: 42px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 14px;
      color: #64748b;
      pointer-events: none;
      background: transparent;
      padding: 0 6px;
      border-radius: 4px;
      transition: top 0.2s cubic-bezier(0.22, 1, 0.36, 1),
                  left 0.2s cubic-bezier(0.22, 1, 0.36, 1),
                  font-size 0.2s cubic-bezier(0.22, 1, 0.36, 1),
                  color 0.2s ease,
                  background-color 0.2s ease;
    }

    .outlined-field.is-focused .floating-label,
    .outlined-field.has-value .floating-label {
      top: 0;
      left: 14px;
      font-size: 11.5px;
      font-weight: 600;
      color: #6d28d9;
      background: #ffffff;
    }

    .outlined-field input {
      flex: 1;
      min-width: 0;
      height: 100%;
      border: 0;
      outline: none;
      background: transparent;
      font-size: 15px;
      color: #0f172a;
      padding: 0 14px 0 0;
    }

    .pw-toggle {
      border: 0;
      background: transparent;
      color: #64748b;
      padding: 0 14px;
      height: 100%;
      display: flex;
      align-items: center;
      cursor: pointer;
      transition: color 0.15s ease;
    }

    .pw-toggle:hover {
      color: #6d28d9;
    }

    .options-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 0 22px;
      font-size: 13px;
    }

    .remember-check {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      color: #6b7280;
      cursor: pointer;
      user-select: none;
    }

    .remember-check input {
      width: 14px;
      height: 14px;
      accent-color: #7c3aed;
      margin: 0;
      cursor: pointer;
    }

    .text-link {
      border: 0;
      background: transparent;
      padding: 0;
      font-size: 11.5px;
      color: #4b5563;
      cursor: pointer;
      transition: color 0.15s ease;
    }

    .text-link:hover {
      color: #6d28d9;
      text-decoration: underline;
    }

    .info-msg {
      padding: 8px 11px;
      border-radius: 8px;
      background: #f5f3ff;
      border: 1px solid #ddd6fe;
      color: #5b21b6;
      font-size: 11.5px;
      margin-bottom: 12px;
    }

    .error-msg {
      padding: 8px 11px;
      border-radius: 8px;
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: #dc2626;
      font-size: 11.5px;
      margin-bottom: 12px;
    }

    .login-submit {
      width: 100%;
      height: 50px;
      border: 0;
      border-radius: 14px;
      background: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%);
      opacity: 0.82;
      color: #ffffff;
      font-size: 15px;
      font-weight: 600;
      letter-spacing: 0.01em;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      box-shadow: 0 8px 20px rgba(124, 58, 237, 0.22);
      transition: background 0.25s cubic-bezier(0.22, 1, 0.36, 1),
                  transform 0.2s cubic-bezier(0.22, 1, 0.36, 1),
                  box-shadow 0.25s cubic-bezier(0.22, 1, 0.36, 1),
                  opacity 0.2s ease;
    }

    .login-submit.is-ready {
      opacity: 1;
      background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
      box-shadow: 0 12px 26px rgba(109, 40, 217, 0.3);
    }

    .login-submit.is-ready:hover {
      transform: translateY(-2px) scale(1.005);
      box-shadow: 0 16px 32px rgba(109, 40, 217, 0.38);
    }

    .login-submit.is-ready:active {
      transform: translateY(0) scale(0.99);
    }

    .login-submit:disabled {
      cursor: default;
    }

    .btn-spinner {
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255, 255, 255, 0.35);
      border-top-color: #ffffff;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }

    .signup-row {
      margin-top: 14px;
      text-align: center;
    }

    .signup-link {
      border: 0;
      background: transparent;
      font-size: 12px;
      font-weight: 500;
      color: #4b5563;
      cursor: pointer;
    }

    .signup-link:hover {
      color: #6d28d9;
      text-decoration: underline;
    }

    .demo-hint {
      margin: 22px 0 0;
      text-align: center;
      font-size: 11.5px;
      color: #9ca3af;
    }

    .demo-hint b {
      color: #4b5563;
    }

    .lang-badge {
      position: absolute;
      left: 28px;
      bottom: 22px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11.5px;
      font-weight: 600;
      color: #374151;
    }

    .lang-dot {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: linear-gradient(180deg, #1d4ed8 0 33%, #ffffff 33% 66%, #dc2626 66% 100%);
      border: 1px solid #e5e7eb;
    }

    /* Right Diagonal Lavender-Violet Showcase */
    .visual-panel {
      position: relative;
      display: flex;
      padding: 0;
      background: #ffffff;
    }

    .diagonal-surface {
      position: relative;
      width: 100%;
      height: 100%;
      min-height: 100vh;
      clip-path: polygon(11% 0, 100% 0, 100% 100%, 0% 100%);
      background: linear-gradient(145deg, #eae2fe 0%, #c6aff8 46%, #9b70f2 100%);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      padding: 40px 48px 0 88px;
      overflow: hidden;
      animation: panelSlideIn 0.75s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }

    /* Animated Orbit Rings */
    .orbit-ring {
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
    }

    .orbit-1 {
      width: 480px;
      height: 480px;
      top: 52%;
      left: 54%;
      transform: translate(-50%, -50%);
      border: 2px dashed rgba(255, 255, 255, 0.35);
      animation: orbitSpin 26s linear infinite;
    }

    .orbit-2 {
      width: 360px;
      height: 360px;
      top: 52%;
      left: 54%;
      transform: translate(-50%, -50%);
      border: 1.5px solid rgba(255, 255, 255, 0.28);
      animation: orbitPulse 4.5s ease-in-out infinite;
    }

    /* Rising Sparkle Particles */
    .spark-dot {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.75);
      box-shadow: 0 0 12px rgba(255, 255, 255, 0.85);
      pointer-events: none;
      animation: riseSpark 6.5s linear infinite;
    }

    .dot-1 { width: 8px; height: 8px; left: 22%; bottom: 10%; animation-delay: 0s; }
    .dot-2 { width: 6px; height: 6px; left: 38%; bottom: 18%; animation-delay: -1.8s; }
    .dot-3 { width: 10px; height: 10px; left: 68%; bottom: 12%; animation-delay: -3.2s; }
    .dot-4 { width: 7px; height: 7px; left: 82%; bottom: 24%; animation-delay: -4.6s; }
    .dot-5 { width: 9px; height: 9px; left: 52%; bottom: 6%; animation-delay: -2.4s; }

    /* Floating 3D Glass Icon Orbs */
    .glass-orb {
      position: absolute;
      z-index: 3;
      width: 60px;
      height: 60px;
      border-radius: 18px;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.36), rgba(255, 255, 255, 0.12));
      border: 1.5px solid rgba(255, 255, 255, 0.52);
      backdrop-filter: blur(12px);
      box-shadow: 0 14px 32px rgba(91, 33, 182, 0.22);
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
    }

    .orb-cap {
      top: 15%;
      left: 22%;
      animation: orbFloatA 4.2s ease-in-out infinite;
    }

    .orb-book {
      top: 20%;
      right: 14%;
      animation: orbFloatB 4.8s ease-in-out infinite;
    }

    .orb-star {
      bottom: 34%;
      left: 16%;
      width: 54px;
      height: 54px;
      border-radius: 50%;
      animation: orbFloatB 3.9s ease-in-out infinite reverse;
    }

    .orb-spark {
      bottom: 24%;
      right: 12%;
      width: 52px;
      height: 52px;
      border-radius: 50%;
      animation: orbFloatA 3.6s ease-in-out infinite reverse;
    }

    /* Floating 3D Glass Accents */
    .glass-shape {
      position: absolute;
      border-radius: 26px;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.06));
      border: 1.5px solid rgba(255, 255, 255, 0.35);
      backdrop-filter: blur(8px);
      pointer-events: none;
    }

    .shape-1 {
      width: 170px;
      height: 170px;
      left: 34px;
      top: 42%;
      transform: rotate(18deg);
      animation: floatGlass1 5.5s ease-in-out infinite;
    }

    .shape-2 {
      width: 115px;
      height: 115px;
      right: 36px;
      top: 44%;
      border-radius: 22px;
      transform: rotate(-16deg);
      animation: floatGlass2 6.2s ease-in-out infinite;
    }

    /* 3D Student Image Stage */
    .student-stage {
      position: relative;
      z-index: 2;
      flex: 1;
      width: 100%;
      display: flex;
      align-items: flex-end;
      justify-content: center;
    }

    .student-img {
      width: min(500px, 92%);
      max-height: 82vh;
      object-fit: contain;
      object-position: bottom center;
      -webkit-mask-image: radial-gradient(ellipse 68% 76% at 50% 60%, #000 42%, transparent 92%);
      mask-image: radial-gradient(ellipse 68% 76% at 50% 60%, #000 42%, transparent 92%);
      filter: drop-shadow(0 18px 34px rgba(76, 29, 149, 0.25));
      animation:
        studentEnter 0.85s cubic-bezier(0.22, 1, 0.36, 1) 0.1s backwards,
        studentFloat 4s ease-in-out 0.9s infinite;
    }

    /* Keyframes */
    @keyframes formEnter {
      from { opacity: 0; transform: translateX(-18px); }
      to { opacity: 1; transform: translateX(0); }
    }

    @keyframes panelSlideIn {
      from { opacity: 0; transform: translateX(24px); }
      to { opacity: 1; transform: translateX(0); }
    }

    @keyframes badgePop {
      from { opacity: 0; transform: translateY(-12px) scale(0.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    @keyframes studentEnter {
      from { opacity: 0; transform: translateY(34px) scale(0.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    @keyframes studentFloat {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-14px) scale(1.015); }
    }

    @keyframes orbitSpin {
      from { transform: translate(-50%, -50%) rotate(0deg); }
      to { transform: translate(-50%, -50%) rotate(360deg); }
    }

    @keyframes orbitPulse {
      0%, 100% { transform: translate(-50%, -50%) scale(0.95); opacity: 0.45; }
      50% { transform: translate(-50%, -50%) scale(1.06); opacity: 0.9; }
    }

    @keyframes orbFloatA {
      0%, 100% { transform: translateY(0) rotate(-4deg) scale(1); }
      50% { transform: translateY(-20px) rotate(6deg) scale(1.07); }
    }

    @keyframes orbFloatB {
      0%, 100% { transform: translateY(0) rotate(5deg) scale(1); }
      50% { transform: translateY(18px) rotate(-6deg) scale(1.06); }
    }

    @keyframes riseSpark {
      0% { transform: translateY(0) scale(0.6); opacity: 0; }
      20% { opacity: 0.9; }
      80% { opacity: 0.7; }
      100% { transform: translateY(-380px) scale(1.1); opacity: 0; }
    }

    @keyframes floatGlass1 {
      0%, 100% { transform: translateY(0) rotate(18deg); }
      50% { transform: translateY(-18px) rotate(24deg); }
    }

    @keyframes floatGlass2 {
      0%, 100% { transform: translateY(0) rotate(-16deg); }
      50% { transform: translateY(16px) rotate(-10deg); }
    }

    @keyframes shakeForm {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-6px); }
      75% { transform: translateX(6px); }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 960px) {
      .login-page {
        grid-template-columns: 1fr;
      }

      .visual-panel {
        display: none;
      }

      .form-panel {
        padding: 36px 24px 64px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  rememberMe = true;
  loading = false;
  errorMessage = '';
  infoMessage = '';
  showPassword = false;
  focusedField: 'none' | 'username' | 'password' = 'none';

  constructor(private auth: AuthService, private data: DataService, private router: Router) {}

  onForgotPassword(): void {
    this.errorMessage = '';
    this.infoMessage = 'Contact your system administrator to reset your password.';
  }

  onQuickAction(provider: string): void {
    this.errorMessage = '';
    this.infoMessage = `${provider} sign-in is not configured. Please use your username and password below.`;
  }

  submit(): void {
    this.errorMessage = '';
    this.loading = true;
    this.auth.login(this.username, this.password).subscribe({
      next: response => {
        if (response?.success && response.data?.token) {
          this.data.reset();
          this.data.preload().subscribe();
          this.loading = false;
          this.router.navigate(['/dashboard']);
        } else {
          this.loading = false;
          this.errorMessage = 'Incorrect password or username';
        }
      },
      error: (err) => {
        this.loading = false;
        const apiMessage = err?.error?.message;
        if (err?.status === 401 || (apiMessage && /password|username/i.test(apiMessage))) {
          this.errorMessage = 'Incorrect password or username';
        } else {
          this.errorMessage = apiMessage || 'Cannot reach the backend. Make sure it is running on port 5000.';
        }
      }
    });
  }
}
