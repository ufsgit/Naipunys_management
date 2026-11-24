import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from './icon.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="modal-overlay" *ngIf="isOpen" (click)="onBackdropClick($event)">
      <div class="modal-dialog" [ngClass]="sizeClass" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3 class="modal-title">{{ title }}</h3>
          <button type="button" class="modal-close" (click)="close()">
            <app-icon name="x" [size]="20"></app-icon>
          </button>
        </div>
        <div class="modal-body">
          <ng-content select="[modal-body]"></ng-content>
          <ng-content></ng-content>
        </div>
        <div class="modal-footer" *ngIf="showFooter">
          <ng-content select="[modal-footer]"></ng-content>
          <ng-container *ngIf="!customFooter">
            <button type="button" class="btn btn-secondary" (click)="close()">{{ cancelText }}</button>
            <button type="button" class="btn btn-primary" (click)="confirm()">{{ confirmText }}</button>
          </ng-container>
        </div>
      </div>
    </div>
  `
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() showFooter = true;
  @Input() customFooter = false;
  @Input() confirmText = 'Save';
  @Input() cancelText = 'Cancel';

  @Output() closeEvent = new EventEmitter<void>();
  @Output() confirmEvent = new EventEmitter<void>();

  get sizeClass(): string {
    return this.size === 'lg' ? 'modal-lg' : this.size === 'sm' ? 'modal-sm' : '';
  }

  close() {
    this.closeEvent.emit();
  }

  confirm() {
    this.confirmEvent.emit();
  }

  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close();
    }
  }
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="modal-overlay" *ngIf="isOpen">
      <div class="modal-dialog modal-sm">
        <div class="modal-header">
          <h3 class="modal-title">{{ title }}</h3>
          <button type="button" class="modal-close" (click)="cancel()">
            <app-icon name="x" [size]="18"></app-icon>
          </button>
        </div>
        <div class="modal-body">
          <p style="color: var(--text-secondary); line-height: 1.5;">{{ message }}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" (click)="cancel()">{{ cancelText }}</button>
          <button type="button" class="btn" [ngClass]="confirmBtnClass" (click)="confirm()">{{ confirmText }}</button>
        </div>
      </div>
    </div>
  `
})
export class ConfirmDialogComponent {
  @Input() isOpen = false;
  @Input() title = 'Confirm Action';
  @Input() message = 'Are you sure you want to proceed?';
  @Input() confirmText = 'Confirm';
  @Input() cancelText = 'Cancel';
  @Input() type: 'danger' | 'primary' | 'warning' = 'danger';

  @Output() confirmEvent = new EventEmitter<void>();
  @Output() cancelEvent = new EventEmitter<void>();

  get confirmBtnClass(): string {
    return this.type === 'danger' ? 'btn-danger' : this.type === 'warning' ? 'btn-warning' : 'btn-primary';
  }

  confirm() {
    this.confirmEvent.emit();
  }

  cancel() {
    this.cancelEvent.emit();
  }
}
