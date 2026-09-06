import { Injectable, Signal, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { toast } from '@spartan-ng/brain/sonner';
import { Observable, tap } from 'rxjs';
import { StudentService as StudentApi } from '../../../shared/api/generated/student/student.service';
import { createPagedList } from '../../../shared/lib/paged-list';
import { toApiSortDirection } from '../../../shared/lib/sort-direction';
import { CreateStudentDto, Student, UpdateStudentDto } from './student.model';

@Injectable({ providedIn: 'root' })
export class StudentDataAccess {
  private readonly api = inject(StudentApi);
  private readonly translate = inject(TranslateService);

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

  studentByNumber(number: Signal<number>) {
    return rxResource({
      params: () => number(),
      stream: ({ params }) => this.api.getStudent(params, 'application/json'),
    });
  }

  createStudent(dto: CreateStudentDto): Observable<Student> {
    return this.api
      .createStudent(dto, 'application/json')
      .pipe(tap(() => this.onMutated('common.toast.created')));
  }

  updateStudent(number: number, dto: UpdateStudentDto): Observable<void> {
    return this.api
      .updateStudent(number, dto)
      .pipe(tap(() => this.onMutated('common.toast.updated')));
  }

  deleteStudent(number: number): Observable<void> {
    return this.api.deleteStudent(number).pipe(tap(() => this.onMutated('common.toast.deleted')));
  }

  private onMutated(toastKey: string): void {
    this.list.reload();
    toast.success(this.translate.instant(toastKey));
  }
}
