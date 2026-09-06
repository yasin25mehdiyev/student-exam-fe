import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ConfirmDialog } from '../../../shared/ui/confirm-dialog';
import { PageHeader } from '../../../shared/ui/custom/page-header';
import { Exam } from '../data-access/exam.model';
import { ExamDataAccess } from '../data-access/exam.service';
import { ExamTable } from '../ui/exam-table';

@Component({
  selector: 'app-exam-list-page',
  imports: [ExamTable, ConfirmDialog, TranslatePipe, PageHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-header
      [title]="'exams.title' | translate"
      [description]="'exams.pageDescription' | translate"
    />

    <app-exam-table
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
      (create)="router.navigate(['/exams/new'])"
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
export class ExamListPage {
  protected readonly data = inject(ExamDataAccess);
  protected readonly router = inject(Router);
  private readonly translate = inject(TranslateService);

  protected readonly pendingDelete = signal<Exam | null>(null);

  constructor() {
    this.data.list.activate();
  }
  // Deliberately not calling activateFormOptions() here - this page never renders the
  // course/student pickers, only ExamCreatePage does.

  protected readonly deleteMessage = computed(() => {
    const exam = this.pendingDelete();
    return exam
      ? this.translate.instant('exams.deleteConfirm', {
          course: exam.courseName,
          student: exam.studentFullName,
        })
      : '';
  });

  protected onEdit(exam: Exam): void {
    this.router.navigate(['/exams', exam.id, 'edit']);
  }

  protected onDeleteDialogOpenChange(open: boolean): void {
    if (!open) {
      this.pendingDelete.set(null);
    }
  }

  protected confirmDelete(): void {
    const exam = this.pendingDelete();
    if (!exam) {
      return;
    }
    this.data.deleteExam(exam.id ?? 0).subscribe(() => this.pendingDelete.set(null));
  }
}
