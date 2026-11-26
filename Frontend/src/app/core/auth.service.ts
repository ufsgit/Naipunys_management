import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    valid: boolean;
    token: string;
    user: {
      id: number;
      username: string;
      role_name: string;
      branch_id: number;
    };
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'naipunya_token';
  private readonly USER_KEY = 'naipunya_user';

  currentUser = signal<any>(this.getStoredUser());

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, { username, password }).pipe(
      tap(response => {
        if (response.success && response.data?.token) {
          this.saveSession(response.data.token, response.data.user);
        }
      })
    );
  }

  saveSession(token: string, user: any): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUser.set(user);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getStoredUser(): any {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
  }
}
