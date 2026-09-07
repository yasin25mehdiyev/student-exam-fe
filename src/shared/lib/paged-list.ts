import { Signal, computed, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { SortDir } from './sort-direction';

export interface PagedQuery {
  readonly pageNumber: number;
  readonly pageSize: number;
  readonly search: string;
  readonly sortBy?: string;
  readonly sortDirection: SortDir;
}

export interface PagedResultLike<T> {
  items?: T[] | null;
  pageNumber?: number;
  pageSize?: number;
  totalCount?: number;
  totalPages?: number;
}

export interface PagedList<T> {
  readonly query: Signal<PagedQuery>;
  readonly items: Signal<T[]>;
  readonly totalCount: Signal<number>;
  readonly totalPages: Signal<number>;
  readonly isLoading: Signal<boolean>;
  readonly error: Signal<Error | undefined>;
  setPage(pageNumber: number): void;
  setSearch(search: string): void;
  setSort(sortBy: string | undefined, sortDirection?: SortDir): void;
  reload(): void;
  activate(): void;
}

const DEFAULT_QUERY: PagedQuery = {
  pageNumber: 1,
  pageSize: 10,
  search: '',
  sortBy: undefined,
  sortDirection: 'asc',
};

export function createPagedList<T>(
  load: (query: PagedQuery) => Observable<PagedResultLike<T>>,
  defaults?: Partial<PagedQuery>,
): PagedList<T> {
  const query = signal<PagedQuery>({ ...DEFAULT_QUERY, ...defaults });
  const active = signal(false);

  const resource = rxResource({
    params: () => (active() ? query() : undefined),
    stream: ({ params }) => load(params),
  });

  return {
    query: query.asReadonly(),
    items: computed(() => resource.value()?.items ?? []),
    totalCount: computed(() => resource.value()?.totalCount ?? 0),
    totalPages: computed(() => resource.value()?.totalPages ?? 0),
    isLoading: resource.isLoading,
    error: resource.error,
    setPage: (pageNumber) => query.update((q) => ({ ...q, pageNumber })),
    setSearch: (search) => query.update((q) => ({ ...q, search, pageNumber: 1 })),
    setSort: (sortBy, sortDirection = 'asc') =>
      query.update((q) => ({ ...q, sortBy, sortDirection, pageNumber: 1 })),
    reload: () => resource.reload(),
    activate: () => active.set(true),
  };
}
