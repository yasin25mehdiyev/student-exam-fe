import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ROUTE_PATHS } from '../../../shared/lib/route-paths';
import { PageHeader } from '../../../shared/ui/custom/page-header';
import { ExamDataAccess } from '../data-access/exam.service';
import { ExamForm, ExamFormValue } from '../ui/exam-form';

@Component({
  selector: 'app-exam-create-page',
  imports: [ExamForm, TranslatePipe, PageHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-header [title]="'exams.createTitle' | translate" />
    <app-exam-form
      mode="create"
      [saving]="saving()"
      [courseOptions]="courseOptions()"
      [studentOptions]="studentOptions()"
      (save)="onSave($event)"
    />
  `,
})
export class ExamCreatePage {
  private readonly data = inject(ExamDataAccess);
  private readonly router = inject(Router);

  protected readonly saving = signal(false);
  protected readonly courseOptions = computed(() => this.data.courseOptions.value()?.items ?? []);
  protected readonly studentOptions = computed(() => this.data.studentOptions.value()?.items ?? []);

  constructor() {
    this.data.activateFormOptions();
  }

  protected onSave(value: ExamFormValue): void {
    this.saving.set(true);
    this.data.createExam(value).subscribe({
      next: () => this.router.navigate([ROUTE_PATHS.exams]),
      error: () => this.saving.set(false),
    });
  }
}
