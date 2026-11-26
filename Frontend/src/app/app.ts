import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DataService } from './core/data.service';
import { NotificationService } from './core/notification.service';
import { ModalComponent } from './shared/components/modal.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, ModalComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly loading = signal(false);

  constructor(data: DataService, public notify: NotificationService) {
    data.loading$.subscribe(value => this.loading.set(value));
  }
}
