import { Injectable, Signal, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CourseService as CourseApi } from '../../../shared/api/generated/course/course.service';
import { ReportService as ReportApi } from '../../../shared/api/generated/report/report.service';

@Injectable({ providedIn: 'root' })
export class ReportDataAccess {
  private readonly api = inject(ReportApi);
  private readonly courseApi = inject(CourseApi);

  // `courseOptions` (the class-averages filter dropdown) and `classAverages` itself only belong
  // to the "class averages" tab - gated behind `activateClassAverages()` (called only when that
  // tab becomes active) so visiting the "student report" tab doesn't fire them too.
  private readonly classAveragesActive = signal(false);

  readonly courseOptions = rxResource({
    params: () => (this.classAveragesActive() ? true : undefined),
    stream: () => this.courseApi.getCourses('application/json', { PageSize: 100, SortBy: 'name' }),
  });

  activateClassAverages(): void {
    this.classAveragesActive.set(true);
  }

  studentReport(studentNumber: Signal<number | undefined>) {
    return rxResource({
      params: () => studentNumber(),
      stream: ({ params }) => this.api.getStudentReport(params, 'application/json'),
    });
  }

  /** `courseCode` is `''` for "all courses" - still always resolved once the tab is active. */
  classAverages(courseCode: Signal<string>) {
    return rxResource({
      params: () => (this.classAveragesActive() ? courseCode() : undefined),
      stream: ({ params }) =>
        this.api.getClassAverages('application/json', { courseCode: params || undefined }),
    });
  }
}
