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
import { PageHeader } from '../../../shared/ui/custom/page-header';
import { StudentDataAccess } from '../data-access/student.service';
import { StudentForm, StudentFormValue } from '../ui/student-form';

@Component({
  selector: 'app-student-edit-page',
  imports: [StudentForm, TranslatePipe, PageHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-header [title]="'students.editTitle' | translate" />
    @if (studentResource.hasValue()) {
      <app-student-form
        mode="edit"
        [initialValue]="studentResource.value()"
        [saving]="saving()"
        (save)="onSave($event)"
      />
    }
  `,
})
export class StudentEditPage {
  readonly number = input.required<string>();

  private readonly data = inject(StudentDataAccess);
  private readonly router = inject(Router);

  private readonly numberValue = computed(() => Number(this.number()));
  protected readonly studentResource = this.data.studentByNumber(this.numberValue);
  protected readonly saving = signal(false);

  constructor() {
    // A bad/deleted number makes the lookup 404 - route to the not-found page instead of leaving
    // this page rendering just the header with an empty body underneath.
    effect(() => {
      if (this.studentResource.error()) {
        this.router.navigateByUrl('/not-found');
      }
    });
  }

  protected onSave(value: StudentFormValue): void {
    this.saving.set(true);
    this.data.updateStudent(this.numberValue(), value).subscribe({
      next: () => this.router.navigate(['/students']),
      error: () => this.saving.set(false),
    });
  }
}
