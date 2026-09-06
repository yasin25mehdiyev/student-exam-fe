import { SortDirection } from '../api/generated/models';
import { toApiSortDirection } from './sort-direction';

describe('toApiSortDirection', () => {
  it('maps "asc" to SortDirection.NUMBER_0', () => {
    expect(toApiSortDirection('asc')).toBe(SortDirection.NUMBER_0);
  });

  it('maps "desc" to SortDirection.NUMBER_1', () => {
    expect(toApiSortDirection('desc')).toBe(SortDirection.NUMBER_1);
  });
});
