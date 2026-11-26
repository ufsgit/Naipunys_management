import { Injectable, signal } from '@angular/core';

export interface AppAlert {
  title: string;
  message: string;
  type: 'primary' | 'danger' | 'warning';
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  readonly alert = signal<AppAlert | null>(null);

  show(message: string, title = 'Notice', type: 'primary' | 'danger' | 'warning' = 'primary') {
    this.alert.set({ title, message, type });
  }

  close() {
    this.alert.set(null);
  }
}
