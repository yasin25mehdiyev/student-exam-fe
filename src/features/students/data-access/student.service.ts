import { Injectable, Signal, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable, tap } from 'rxjs';
import { StudentService as StudentApi } from '../../../shared/api/generated/student/student.service';
import { createMutationNotifier } from '../../../shared/lib/mutation-toast';
import { createPagedList } from '../../../shared/lib/paged-list';
import { toApiSortDirection } from '../../../shared/lib/sort-direction';
import { CreateStudentDto, Student, UpdateStudentDto } from './student.model';

@Injectable({ providedIn: 'root' })
export class StudentDataAccess {
  private readonly api = inject(StudentApi);

  readonly list = createPagedList<Student>(
    (query) =>
      this.api.getStudents('application/json', {
        PageNumber: query.pageNumber,
        PageSize: query.pageSize,
        Search: query.search || undefined,
        SortBy: query.sortBy,
        SortDirection: toApiSortDirection(query.sortDirection),
      }),
    { sortBy: 'lastName' },
  );

  private readonly notifyMutated = createMutationNotifier(this.list);

  studentByNumber(number: Signal<number>) {
    return rxResource({
      params: () => number(),
      stream: ({ params }) => this.api.getStudent(params, 'application/json'),
    });
  }

  createStudent(dto: CreateStudentDto): Observable<Student> {
    return this.api
      .createStudent(dto, 'application/json')
      .pipe(tap(() => this.notifyMutated('common.toast.created')));
  }

  updateStudent(number: number, dto: UpdateStudentDto): Observable<void> {
    return this.api
      .updateStudent(number, dto)
      .pipe(tap(() => this.notifyMutated('common.toast.updated')));
  }

  deleteStudent(number: number): Observable<void> {
    return this.api
      .deleteStudent(number)
      .pipe(tap(() => this.notifyMutated('common.toast.deleted')));
  }
}
