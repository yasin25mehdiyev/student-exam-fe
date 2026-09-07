import { Injectable, Signal, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable, tap } from 'rxjs';
import { CourseService as CourseApi } from '../../../shared/api/generated/course/course.service';
import { createMutationNotifier } from '../../../shared/lib/mutation-toast';
import { createPagedList } from '../../../shared/lib/paged-list';
import { toApiSortDirection } from '../../../shared/lib/sort-direction';
import { Course, CreateCourseDto, UpdateCourseDto } from './course.model';

@Injectable({ providedIn: 'root' })
export class CourseDataAccess {
  private readonly api = inject(CourseApi);

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

  private readonly notifyMutated = createMutationNotifier(this.list);

  courseByCode(code: Signal<string>) {
    return rxResource({
      params: () => code(),
      stream: ({ params }) => this.api.getCourse(params, 'application/json'),
    });
  }

  createCourse(dto: CreateCourseDto): Observable<Course> {
    return this.api
      .createCourse(dto, 'application/json')
      .pipe(tap(() => this.notifyMutated('common.toast.created')));
  }

  updateCourse(code: string, dto: UpdateCourseDto): Observable<void> {
    return this.api
      .updateCourse(code, dto)
      .pipe(tap(() => this.notifyMutated('common.toast.updated')));
  }

  deleteCourse(code: string): Observable<void> {
    return this.api.deleteCourse(code).pipe(tap(() => this.notifyMutated('common.toast.deleted')));
  }
}
