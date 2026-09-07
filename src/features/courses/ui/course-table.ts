import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { SortDir } from '../../../shared/lib/sort-direction';
import { DataTable, DataTableColumn } from '../../../shared/ui/custom/data-table';
import { HlmTd } from '@spartan-ng/helm/table';
import { Course } from '../data-access/course.model';

const COLUMNS: readonly DataTableColumn[] = [
  { labelKey: 'courses.fields.code' },
  { labelKey: 'courses.fields.name', sortKey: 'name' },
  { labelKey: 'courses.fields.classLevel', sortKey: 'classLevel' },
  { labelKey: 'courses.fields.teacherFirstName' },
];

@Component({
  selector: 'app-course-table',
  imports: [DataTable, HlmTd],
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
      searchPlaceholderKey="courses.table.searchPlaceholder"
      emptyMessageKey="courses.table.empty"
      [trackByFn]="trackByCode"
      (searchChange)="searchChange.emit($event)"
      (sortChange)="sortChange.emit($event)"
      (page)="page.emit($event)"
      (create)="create.emit()"
      (edit)="edit.emit($event)"
      (delete)="delete.emit($event)"
    >
      <ng-template #rowCells let-course>
        <td hlmTd class="font-mono">{{ course.code }}</td>
        <td hlmTd>{{ course.name }}</td>
        <td hlmTd>{{ course.classLevel }}</td>
        <td hlmTd>{{ course.teacherFirstName }} {{ course.teacherLastName }}</td>
      </ng-template>
    </app-data-table>
  `,
})
export class CourseTable {
  readonly items = input.required<readonly Course[]>();
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
  readonly edit = output<Course>();
  readonly delete = output<Course>();

  protected readonly columns = COLUMNS;
  protected readonly trackByCode = (course: Course): unknown => course.code;
}
