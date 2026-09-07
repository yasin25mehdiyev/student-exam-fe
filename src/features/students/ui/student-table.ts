import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { HlmTd } from '@spartan-ng/helm/table';
import { SortDir } from '../../../shared/lib/sort-direction';
import { DataTable, DataTableColumn } from '../../../shared/ui/custom/data-table';
import { Student } from '../data-access/student.model';

const COLUMNS: readonly DataTableColumn[] = [
  { labelKey: 'students.fields.number' },
  { labelKey: 'students.fields.firstName', sortKey: 'firstName' },
  { labelKey: 'students.fields.lastName', sortKey: 'lastName' },
  { labelKey: 'students.fields.classLevel', sortKey: 'classLevel' },
];

@Component({
  selector: 'app-student-table',
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
      searchPlaceholderKey="students.table.searchPlaceholder"
      emptyMessageKey="students.table.empty"
      [trackByFn]="trackByNumber"
      (searchChange)="searchChange.emit($event)"
      (sortChange)="sortChange.emit($event)"
      (page)="page.emit($event)"
      (create)="create.emit()"
      (edit)="edit.emit($event)"
      (delete)="delete.emit($event)"
    >
      <ng-template #rowCells let-student>
        <td hlmTd class="font-mono">{{ student.number }}</td>
        <td hlmTd>{{ student.firstName }}</td>
        <td hlmTd>{{ student.lastName }}</td>
        <td hlmTd>{{ student.classLevel }}</td>
      </ng-template>
    </app-data-table>
  `,
})
export class StudentTable {
  readonly items = input.required<readonly Student[]>();
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
  readonly edit = output<Student>();
  readonly delete = output<Student>();

  protected readonly columns = COLUMNS;
  protected readonly trackByNumber = (student: Student): unknown => student.number;
}
