import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronRight } from '@ng-icons/lucide';

type PageEntry = number | '...';

const PAGE_BUTTON_BASE =
  'flex aspect-square size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-sm transition-colors disabled:cursor-not-allowed disabled:border-disabled-border disabled:bg-disabled disabled:text-ink-disabled';

@Component({
  selector: 'app-data-table-pagination',
  imports: [NgIcon],
  providers: [provideIcons({ lucideChevronLeft, lucideChevronRight })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-center gap-1">
      <button
        type="button"
        [class]="PAGE_BUTTON_BASE + ' border border-brand-100 text-brand-500 hover:border-brand-400 hover:bg-wash'"
        [disabled]="currentPage() <= 1"
        (click)="pageChange.emit(currentPage() - 1)"
      >
        <ng-icon name="lucideChevronLeft" size="16" />
      </button>

      @for (page of pageNumbers(); track $index) {
        @if (page === '...') {
          <span class="px-1 text-sm text-ink-tertiary">…</span>
        } @else {
          <button
            type="button"
            [class]="
              PAGE_BUTTON_BASE +
              (page === currentPage()
                ? ' cursor-default bg-brand-500 text-white'
                : ' border border-brand-100 text-brand-500 hover:border-brand-400 hover:bg-wash')
            "
            (click)="pageChange.emit(page)"
          >
            {{ page }}
          </button>
        }
      }

      <button
        type="button"
        [class]="PAGE_BUTTON_BASE + ' border border-brand-100 text-brand-500 hover:border-brand-400 hover:bg-wash'"
        [disabled]="currentPage() >= totalPages()"
        (click)="pageChange.emit(currentPage() + 1)"
      >
        <ng-icon name="lucideChevronRight" size="16" />
      </button>
    </div>
  `,
})
export class DataTablePagination {
  readonly currentPage = input.required<number>();
  readonly totalPages = input.required<number>();
  readonly pageChange = output<number>();

  protected readonly PAGE_BUTTON_BASE = PAGE_BUTTON_BASE;

  protected readonly pageNumbers = computed<PageEntry[]>(() => {
    const total = this.totalPages();
    const current = this.currentPage();

    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

    const pages: PageEntry[] = [1];
    if (current > 3) pages.push('...');

    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i);
    }

    if (current < total - 2) pages.push('...');
    pages.push(total);

    return pages;
  });
}
