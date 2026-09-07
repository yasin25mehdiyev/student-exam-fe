import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ROUTE_PATHS } from '../../../shared/lib/route-paths';
import { PageHeader } from '../../../shared/ui/custom/page-header';
import { ExamDataAccess } from '../data-access/exam.service';
import { ExamForm, ExamFormValue } from '../ui/exam-form';

@Component({
  selector: 'app-exam-edit-page',
  imports: [ExamForm, TranslatePipe, PageHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-header [title]="'exams.editTitle' | translate" />
    @if (examResource.hasValue()) {
      <app-exam-form
        mode="edit"
        [initialValue]="examResource.value()"
        [saving]="saving()"
        (save)="onSave($event)"
      />
    }
  `,
})
export class ExamEditPage {
  readonly id = input.required<string>();

  private readonly data = inject(ExamDataAccess);
  private readonly router = inject(Router);

  private readonly idValue = computed(() => Number(this.id()));
  protected readonly examResource = this.data.examById(this.idValue);
  protected readonly saving = signal(false);

  constructor() {
    effect(() => {
      if (this.examResource.error()) {
        this.router.navigateByUrl(ROUTE_PATHS.notFound);
      }
    });
  }

  protected onSave(value: ExamFormValue): void {
    this.saving.set(true);
    this.data.updateExam(this.idValue(), value).subscribe({
      next: () => this.router.navigate([ROUTE_PATHS.exams]),
      error: () => this.saving.set(false),
    });
  }
}
