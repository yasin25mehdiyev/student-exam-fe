import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ROUTE_PATHS } from '../../../shared/lib/route-paths';
import { ConfirmDialog } from '../../../shared/ui/custom/confirm-dialog';
import { PageHeader } from '../../../shared/ui/custom/page-header';
import { Student } from '../data-access/student.model';
import { StudentDataAccess } from '../data-access/student.service';
import { StudentTable } from '../ui/student-table';

@Component({
  selector: 'app-student-list-page',
  imports: [StudentTable, ConfirmDialog, TranslatePipe, PageHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-header
      [title]="'students.title' | translate"
      [description]="'students.pageDescription' | translate"
    />

    <app-student-table
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
      (create)="router.navigate([routePaths.students, 'new'])"
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
export class StudentListPage {
  protected readonly data = inject(StudentDataAccess);
  protected readonly router = inject(Router);
  protected readonly routePaths = ROUTE_PATHS;
  private readonly translate = inject(TranslateService);

  protected readonly pendingDelete = signal<Student | null>(null);

  constructor() {
    this.data.list.activate();
  }

  protected readonly deleteMessage = computed(() => {
    const student = this.pendingDelete();
    return student
      ? this.translate.instant('students.deleteConfirm', {
          name: `${student.firstName} ${student.lastName}`,
        })
      : '';
  });

  protected onEdit(student: Student): void {
    this.router.navigate([ROUTE_PATHS.students, student.number, 'edit']);
  }

  protected onDeleteDialogOpenChange(open: boolean): void {
    if (!open) {
      this.pendingDelete.set(null);
    }
  }

  protected confirmDelete(): void {
    const student = this.pendingDelete();
    if (!student) {
      return;
    }
    this.data.deleteStudent(student.number ?? 0).subscribe(() => this.pendingDelete.set(null));
  }
}
