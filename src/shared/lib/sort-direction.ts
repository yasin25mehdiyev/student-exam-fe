import { SortDirection } from '../api/generated/models';

export type SortDir = 'asc' | 'desc';

export function toApiSortDirection(direction: SortDir): SortDirection {
  return direction === 'desc' ? SortDirection.Desc : SortDirection.Asc;
}
