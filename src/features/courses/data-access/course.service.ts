import { Injectable, Signal, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { toast } from '@spartan-ng/brain/sonner';
import { Observable, tap } from 'rxjs';
import { CourseService as CourseApi } from '../../../shared/api/generated/course/course.service';
import { createPagedList } from '../../../shared/lib/paged-list';
import { toApiSortDirection } from '../../../shared/lib/sort-direction';
import { Course, CreateCourseDto, UpdateCourseDto } from './course.model';

@Injectable({ providedIn: 'root' })
export class CourseDataAccess {
  private readonly api = inject(CourseApi);
  private readonly translate = inject(TranslateService);

  readonly list = createPagedList<Course>(
    (query) =>
      this.api.getCourses('application/json', {
        PageNumber: query.pageNumber,
        PageSize: query.pageSize,
        Search: query.search || undefined,
        SortBy: query.sortBy,
        SortDirection: toApiSortDirection(query.sortDirection),
      }),
    { sortBy: 'name' },
  );

  courseByCode(code: Signal<string>) {
    return rxResource({
      params: () => code(),
      stream: ({ params }) => this.api.getCourse(params, 'application/json'),
    });
  }

  createCourse(dto: CreateCourseDto): Observable<Course> {
    return this.api
      .createCourse(dto, 'application/json')
      .pipe(tap(() => this.onMutated('common.toast.created')));
  }

  updateCourse(code: string, dto: UpdateCourseDto): Observable<void> {
    return this.api.updateCourse(code, dto).pipe(tap(() => this.onMutated('common.toast.updated')));
  }

  deleteCourse(code: string): Observable<void> {
    return this.api.deleteCourse(code).pipe(tap(() => this.onMutated('common.toast.deleted')));
  }

  private onMutated(toastKey: string): void {
    this.list.reload();
    toast.success(this.translate.instant(toastKey));
  }
}
