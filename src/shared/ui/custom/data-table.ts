import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  contentChild,
  input,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideChevronDown,
  lucideChevronUp,
  lucidePencil,
  lucidePlus,
  lucideSearch,
  lucideTrash2,
} from '@ng-icons/lucide';
import { TranslatePipe } from '@ngx-translate/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmSkeleton } from '@spartan-ng/helm/skeleton';
import { HlmTooltip } from '@spartan-ng/helm/tooltip';
import {
  HlmTBody,
  HlmTHead,
  HlmTable,
  HlmTableContainer,
  HlmTd,
  HlmTh,
  HlmTr,
} from '@spartan-ng/helm/table';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { SortDir } from '../../lib/sort-direction';
import { smoothLoading } from '../../lib/smooth-loading';
import { DataTablePagination } from './data-table-pagination';

export interface DataTableColumn {
  readonly labelKey: string;
  readonly sortKey?: string;
}

@Component({
  selector: 'app-data-table',
  imports: [
    NgIcon,
    NgTemplateOutlet,
    TranslatePipe,
    HlmButton,
    HlmInput,
    HlmSkeleton,
    HlmTooltip,
    HlmTableContainer,
    HlmTable,
    HlmTHead,
    HlmTBody,
    HlmTr,
    HlmTh,
    HlmTd,
    DataTablePagination,
  ],
  providers: [
    provideIcons({
      lucidePencil,
      lucideTrash2,
      lucideChevronUp,
      lucideChevronDown,
      lucideSearch,
      lucidePlus,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-wrap items-center gap-3 pb-4">
      <div class="relative max-w-72 flex-1">
        <ng-icon
          name="lucideSearch"
          size="16"
          class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
        />
        <input
          hlmInput
          class="w-full bg-white pl-9"
          [placeholder]="searchPlaceholderKey() | translate"
          (input)="onSearchInput($event)"
        />
      </div>
      <button hlmBtn class="ml-auto gap-1.5" (click)="create.emit()">
        <ng-icon name="lucidePlus" size="16" />
        {{ 'common.actions.new' | translate }}
      </button>
    </div>

    <div hlmTableContainer class="overflow-hidden rounded-xl border border-border">
      <table hlmTable>
        <thead hlmTHead>
          <tr hlmTr class="bg-brand-500 hover:bg-brand-500">
            @for (column of columns(); track column.labelKey) {
              <th
                hlmTh
                class="text-white"
                [class.cursor-pointer]="!!column.sortKey"
                [class.select-none]="!!column.sortKey"
                (click)="column.sortKey && toggleSort(column.sortKey)"
              >
                {{ column.labelKey | translate }}
                @if (column.sortKey && sortBy() === column.sortKey) {
                  <ng-icon
                    [name]="sortDirection() === 'asc' ? 'lucideChevronUp' : 'lucideChevronDown'"
                    size="14"
                  />
                }
              </th>
            }
            <th hlmTh class="w-24 text-white"></th>
          </tr>
        </thead>
        <tbody hlmTBody>
          @if (isLoadingSmooth()) {
            @for (row of skeletonRows; track row) {
              <tr hlmTr class="bg-white">
                @for (column of columns(); track column.labelKey) {
                  <td hlmTd><div hlmSkeleton class="h-4 w-full max-w-[140px]"></div></td>
                }
                <td hlmTd>
                  <div class="flex justify-end gap-1">
                    <div hlmSkeleton class="size-7 rounded-full"></div>
                    <div hlmSkeleton class="size-7 rounded-full"></div>
                  </div>
                </td>
              </tr>
            }
          } @else if (items().length === 0) {
            <tr hlmTr class="bg-white">
              <td hlmTd [attr.colspan]="columns().length + 1" class="py-8 text-center text-ink-tertiary">
                {{ emptyMessageKey() | translate }}
              </td>
            </tr>
          } @else {
            @for (item of items(); track trackByFn()(item)) {
              <tr hlmTr class="bg-white">
                <ng-container
                  [ngTemplateOutlet]="rowCells()"
                  [ngTemplateOutletContext]="{ $implicit: item }"
                />
                <td hlmTd>
                  <div class="flex justify-end gap-1">
                    <button
                      hlmBtn
                      variant="ghost"
                      size="icon-sm"
                      [hlmTooltip]="'common.actions.edit' | translate"
                      (click)="edit.emit(item)"
                    >
                      <ng-icon name="lucidePencil" />
                    </button>
                    <button
                      hlmBtn
                      variant="ghost"
                      size="icon-sm"
                      class="text-negative hover:bg-negative-wash hover:text-negative"
                      [hlmTooltip]="'common.actions.delete' | translate"
                      (click)="delete.emit(item)"
                    >
                      <ng-icon name="lucideTrash2" />
                    </button>
                  </div>
                </td>
              </tr>
            }
          }
        </tbody>
      </table>
    </div>

    @if (isLoadingSmooth()) {
      <div class="flex items-center justify-between pt-4">
        <div hlmSkeleton class="h-4 w-24"></div>
      </div>
    } @else if (totalCount() > 0) {
      <div class="flex items-center justify-between pt-4">
        <span class="text-xs text-ink-tertiary">
          {{ 'common.table.totalItems' | translate: { count: totalCount() } }}
        </span>
        @if (totalPages() > 1) {
          <app-data-table-pagination
            [currentPage]="pageNumber()"
            [totalPages]="totalPages()"
            (pageChange)="page.emit($event)"
          />
        }
      </div>
    }
  `,
})
export class DataTable<T> {
  readonly items = input.required<readonly T[]>();
  readonly totalCount = input(0);
  readonly totalPages = input(0);
  readonly pageNumber = input(1);
  readonly isLoading = input(false);
  readonly sortBy = input<string | undefined>(undefined);
  readonly sortDirection = input<SortDir>('asc');
  readonly columns = input.required<readonly DataTableColumn[]>();
  readonly searchPlaceholderKey = input.required<string>();
  readonly emptyMessageKey = input.required<string>();
  readonly trackByFn = input.required<(item: T) => unknown>();

  readonly searchChange = output<string>();
  readonly sortChange = output<{ sortBy: string; sortDirection: SortDir }>();
  readonly page = output<number>();
  readonly create = output<void>();
  readonly edit = output<T>();
  readonly delete = output<T>();

  readonly rowCells = contentChild.required<TemplateRef<{ $implicit: T }>>('rowCells');

  protected readonly skeletonRows = Array.from({ length: 10 }, (_, i) => i);
  protected readonly isLoadingSmooth = smoothLoading(this.isLoading);

  private readonly searchInput$ = new Subject<string>();

  constructor() {
    this.searchInput$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((value) => this.searchChange.emit(value));
  }

  protected onSearchInput(event: Event): void {
    this.searchInput$.next((event.target as HTMLInputElement).value);
  }

  protected toggleSort(field: string): void {
    const nextDirection: SortDir =
      this.sortBy() === field && this.sortDirection() === 'asc' ? 'desc' : 'asc';
    this.sortChange.emit({ sortBy: field, sortDirection: nextDirection });
  }
}
