import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { PageHeader } from '../../../shared/ui/custom/page-header';
import { CourseDataAccess } from '../data-access/course.service';
import { CourseForm, CourseFormValue } from '../ui/course-form';

@Component({
  selector: 'app-course-create-page',
  imports: [CourseForm, TranslatePipe, PageHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-header [title]="'courses.createTitle' | translate" />
    <app-course-form mode="create" [saving]="saving()" (save)="onSave($event)" />
  `,
})
export class CourseCreatePage {
  private readonly data = inject(CourseDataAccess);
  private readonly router = inject(Router);

  protected readonly saving = signal(false);

  protected onSave(value: CourseFormValue): void {
    this.saving.set(true);
    this.data.createCourse(value).subscribe({
      next: () => this.router.navigate(['/courses']),
      error: () => this.saving.set(false),
    });
  }
}
