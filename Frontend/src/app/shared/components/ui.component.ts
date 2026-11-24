import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IconComponent } from './icon.component';

export interface BreadcrumbItem {
  label: string;
  url?: string;
}

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  template: `
    <div class="page-header">
      <div class="page-title-group">
        <h1>
          <app-icon *ngIf="icon" [name]="icon" [size]="22" customClass="text-primary"></app-icon>
          <span>{{ title }}</span>
        </h1>
        <div class="page-breadcrumb" *ngIf="breadcrumbs && breadcrumbs.length > 0">
          <span>Home</span>
          <ng-container *ngFor="let item of breadcrumbs">
            <app-icon name="chevron-right" [size]="12"></app-icon>
            <a *ngIf="item.url" [routerLink]="item.url">{{ item.label }}</a>
            <span *ngIf="!item.url">{{ item.label }}</span>
          </ng-container>
        </div>
      </div>
      <div class="page-actions">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .text-primary {
      color: var(--color-primary);
    }
  `]
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() icon = '';
  @Input() breadcrumbs: BreadcrumbItem[] = [];
}

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="pagination-container" *ngIf="totalItems > 0">
      <div class="pagination-info">
        Showing <strong>{{ startIndex + 1 }}</strong> to <strong>{{ endIndex }}</strong> of <strong>{{ totalItems }}</strong> entries
      </div>
      <div class="pagination-pages">
        <button
          type="button"
          class="page-btn"
          [disabled]="currentPage === 1"
          (click)="changePage(currentPage - 1)"
        >
          <app-icon name="chevron-left" [size]="14"></app-icon>
        </button>

        <button
          *ngFor="let page of pages"
          type="button"
          class="page-btn"
          [class.active]="page === currentPage"
          (click)="changePage(page)"
        >
          {{ page }}
        </button>

        <button
          type="button"
          class="page-btn"
          [disabled]="currentPage === totalPages"
          (click)="changePage(currentPage + 1)"
        >
          <app-icon name="chevron-right" [size]="14"></app-icon>
        </button>
      </div>
    </div>
  `
})
export class PaginationComponent {
  @Input() totalItems = 0;
  @Input() pageSize = 10;
  @Input() currentPage = 1;
  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize) || 1;
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.pageSize, this.totalItems);
  }

  get pages(): number[] {
    const p: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      p.push(i);
    }
    return p;
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }
}

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="filter-card">
      <div class="search-input-wrapper">
        <span class="search-icon">
          <app-icon name="search" [size]="16"></app-icon>
        </span>
        <input
          type="text"
          class="form-control search-input"
          [placeholder]="placeholder"
          [(ngModel)]="searchTerm"
          (ngModelChange)="onSearchChange($event)"
        />
      </div>

      <div class="filter-group">
        <ng-content select="[filters]"></ng-content>
        <button *ngIf="showExport" type="button" class="btn btn-secondary" (click)="onExport()">
          <app-icon name="download" [size]="16"></app-icon>
          <span>Export</span>
        </button>
        <button *ngIf="showPrint" type="button" class="btn btn-secondary" (click)="onPrint()">
          <app-icon name="printer" [size]="16"></app-icon>
          <span>Print</span>
        </button>
      </div>
    </div>
  `
})
export class FilterBarComponent {
  @Input() placeholder = 'Search records...';
  @Input() showExport = true;
  @Input() showPrint = false;
  @Output() search = new EventEmitter<string>();
  @Output() export = new EventEmitter<void>();
  @Output() print = new EventEmitter<void>();

  searchTerm = '';

  onSearchChange(term: string) {
    this.search.emit(term);
  }

  onExport() {
    this.export.emit();
  }

  onPrint() {
    this.print.emit();
  }
}
