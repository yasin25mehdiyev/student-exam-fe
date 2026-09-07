import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ConfirmDialog } from '../../../shared/ui/custom/confirm-dialog';
import { PageHeader } from '../../../shared/ui/custom/page-header';
import { Course } from '../data-access/course.model';
import { CourseDataAccess } from '../data-access/course.service';
import { CourseTable } from '../ui/course-table';

@Component({
  selector: 'app-course-list-page',
  imports: [CourseTable, ConfirmDialog, TranslatePipe, PageHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-header
      [title]="'courses.title' | translate"
      [description]="'courses.pageDescription' | translate"
    />

    <app-course-table
      [items]="data.list.items()"
      [totalCount]="data.list.totalCount()"
      [totalPages]="data.list.totalPages()"
      [pageNumber]="data.list.query().pageNumber"
      [isLoading]="data.list.isLoading()"
      [sortBy]="data.list.query().sortBy"
      [sortDirection]="data.list.query().sortDirection"
      (searchChange)="data.list.setSearch($event)"
      (sortChange)="data.list.setSort($event.sortBy, $event.sortDirection)"
      (page)="data.list.setPage($event)"
      (create)="router.navigate(['/courses/new'])"
      (edit)="onEdit($event)"
      (delete)="pendingDelete.set($event)"
    />

    <app-confirm-dialog
      [open]="!!pendingDelete()"
      [title]="'common.confirmDelete.title' | translate"
      [message]="deleteMessage()"
      (openChange)="onDeleteDialogOpenChange($event)"
      (confirmed)="confirmDelete()"
    />
  `,
})
export class CourseListPage {
  protected readonly data = inject(CourseDataAccess);
  protected readonly router = inject(Router);
  private readonly translate = inject(TranslateService);

  protected readonly pendingDelete = signal<Course | null>(null);

  constructor() {
    this.data.list.activate();
  }

  protected readonly deleteMessage = computed(() => {
    const course = this.pendingDelete();
    return course ? this.translate.instant('courses.deleteConfirm', { name: course.name }) : '';
  });

  protected onEdit(course: Course): void {
    this.router.navigate(['/courses', course.code, 'edit']);
  }

  protected onDeleteDialogOpenChange(open: boolean): void {
    if (!open) {
      this.pendingDelete.set(null);
    }
  }

  protected confirmDelete(): void {
    const course = this.pendingDelete();
    if (!course) {
      return;
    }
    this.data.deleteCourse(course.code ?? '').subscribe(() => this.pendingDelete.set(null));
  }
}
