import { Injectable, Signal, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { toast } from '@spartan-ng/brain/sonner';
import { Observable, tap } from 'rxjs';
import { CourseService as CourseApi } from '../../../shared/api/generated/course/course.service';
import { ExamService as ExamApi } from '../../../shared/api/generated/exam/exam.service';
import { StudentService as StudentApi } from '../../../shared/api/generated/student/student.service';
import { createPagedList } from '../../../shared/lib/paged-list';
import { toApiSortDirection } from '../../../shared/lib/sort-direction';
import { CreateExamDto, Exam, UpdateExamDto } from './exam.model';

@Injectable({ providedIn: 'root' })
export class ExamDataAccess {
  private readonly api = inject(ExamApi);
  private readonly courseApi = inject(CourseApi);
  private readonly studentApi = inject(StudentApi);
  private readonly translate = inject(TranslateService);

  readonly list = createPagedList<Exam>(
    (query) =>
      this.api.getExams('application/json', {
        PageNumber: query.pageNumber,
        PageSize: query.pageSize,
        Search: query.search || undefined,
        SortBy: query.sortBy,
        SortDirection: toApiSortDirection(query.sortDirection),
      }),
    { sortBy: 'examDate', sortDirection: 'desc' },
  );

  private readonly formOptionsActive = signal(false);

  readonly courseOptions = rxResource({
    params: () => (this.formOptionsActive() ? true : undefined),
    stream: () => this.courseApi.getCourses('application/json', { PageSize: 100, SortBy: 'name' }),
  });

  readonly studentOptions = rxResource({
    params: () => (this.formOptionsActive() ? true : undefined),
    stream: () =>
      this.studentApi.getStudents('application/json', { PageSize: 100, SortBy: 'lastName' }),
  });

  activateFormOptions(): void {
    this.formOptionsActive.set(true);
  }

  examById(id: Signal<number>) {
    return rxResource({
      params: () => id(),
      stream: ({ params }) => this.api.getExam(params, 'application/json'),
    });
  }

  createExam(dto: CreateExamDto): Observable<Exam> {
    return this.api
      .createExam(dto, 'application/json')
      .pipe(tap(() => this.onMutated('common.toast.created')));
  }

  updateExam(id: number, dto: UpdateExamDto): Observable<void> {
    return this.api.updateExam(id, dto).pipe(tap(() => this.onMutated('common.toast.updated')));
  }

  deleteExam(id: number): Observable<void> {
    return this.api.deleteExam(id).pipe(tap(() => this.onMutated('common.toast.deleted')));
  }

  private onMutated(toastKey: string): void {
    this.list.reload();
    toast.success(this.translate.instant(toastKey));
  }
}
