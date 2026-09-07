import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { HlmTd } from '@spartan-ng/helm/table';
import { SortDir } from '../../../shared/lib/sort-direction';
import { DataTable, DataTableColumn } from '../../../shared/ui/custom/data-table';
import { ScoreBadge } from '../../../shared/ui/custom/score-badge';
import { Exam } from '../data-access/exam.model';

const COLUMNS: readonly DataTableColumn[] = [
  { labelKey: 'exams.fields.course', sortKey: 'courseName' },
  { labelKey: 'exams.fields.student', sortKey: 'studentName' },
  { labelKey: 'exams.fields.examDate' },
  { labelKey: 'exams.fields.score', sortKey: 'score' },
];

@Component({
  selector: 'app-exam-table',
  imports: [DataTable, HlmTd, ScoreBadge],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-data-table
      [items]="items()"
      [totalCount]="totalCount()"
      [totalPages]="totalPages()"
      [pageNumber]="pageNumber()"
      [isLoading]="isLoading()"
      [sortBy]="sortBy()"
      [sortDirection]="sortDirection()"
      [columns]="columns"
      searchPlaceholderKey="exams.table.searchPlaceholder"
      emptyMessageKey="exams.table.empty"
      [trackByFn]="trackById"
      (searchChange)="searchChange.emit($event)"
      (sortChange)="sortChange.emit($event)"
      (page)="page.emit($event)"
      (create)="create.emit()"
      (edit)="edit.emit($event)"
      (delete)="delete.emit($event)"
    >
      <ng-template #rowCells let-exam>
        <td hlmTd>{{ exam.courseCode }} — {{ exam.courseName }}</td>
        <td hlmTd>{{ exam.studentFullName }}</td>
        <td hlmTd>{{ exam.examDate }}</td>
        <td hlmTd><app-score-badge [score]="exam.score ?? 0" /></td>
      </ng-template>
    </app-data-table>
  `,
})
export class ExamTable {
  readonly items = input.required<readonly Exam[]>();
  readonly totalCount = input(0);
  readonly totalPages = input(0);
  readonly pageNumber = input(1);
  readonly isLoading = input(false);
  readonly sortBy = input<string | undefined>(undefined);
  readonly sortDirection = input<SortDir>('asc');

  readonly searchChange = output<string>();
  readonly sortChange = output<{ sortBy: string; sortDirection: SortDir }>();
  readonly page = output<number>();
  readonly create = output<void>();
  readonly edit = output<Exam>();
  readonly delete = output<Exam>();

  protected readonly columns = COLUMNS;
  protected readonly trackById = (exam: Exam): unknown => exam.id;
}
