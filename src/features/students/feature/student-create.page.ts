import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { PageHeader } from '../../../shared/ui/custom/page-header';
import { StudentDataAccess } from '../data-access/student.service';
import { StudentForm, StudentFormValue } from '../ui/student-form';

@Component({
  selector: 'app-student-create-page',
  imports: [StudentForm, TranslatePipe, PageHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-header [title]="'students.createTitle' | translate" />
    <app-student-form mode="create" [saving]="saving()" (save)="onSave($event)" />
  `,
})
export class StudentCreatePage {
  private readonly data = inject(StudentDataAccess);
  private readonly router = inject(Router);

  protected readonly saving = signal(false);

  protected onSave(value: StudentFormValue): void {
    this.saving.set(true);
    this.data.createStudent(value).subscribe({
      next: () => this.router.navigate(['/students']),
      error: () => this.saving.set(false),
    });
  }
}
