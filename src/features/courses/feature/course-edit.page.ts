import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ROUTE_PATHS } from '../../../shared/lib/route-paths';
import { PageHeader } from '../../../shared/ui/custom/page-header';
import { CourseDataAccess } from '../data-access/course.service';
import { CourseForm, CourseFormValue } from '../ui/course-form';

@Component({
  selector: 'app-course-edit-page',
  imports: [CourseForm, TranslatePipe, PageHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-header [title]="'courses.editTitle' | translate" />
    @if (courseResource.hasValue()) {
      <app-course-form
        mode="edit"
        [initialValue]="courseResource.value()"
        [saving]="saving()"
        (save)="onSave($event)"
      />
    }
  `,
})
export class CourseEditPage {
  readonly code = input.required<string>();

  private readonly data = inject(CourseDataAccess);
  private readonly router = inject(Router);

  protected readonly courseResource = this.data.courseByCode(this.code);
  protected readonly saving = signal(false);

  constructor() {
    effect(() => {
      if (this.courseResource.error()) {
        this.router.navigateByUrl(ROUTE_PATHS.notFound);
      }
    });
  }

  protected onSave(value: CourseFormValue): void {
    this.saving.set(true);
    this.data.updateCourse(this.code(), value).subscribe({
      next: () => this.router.navigate([ROUTE_PATHS.courses]),
      error: () => this.saving.set(false),
    });
  }
}
