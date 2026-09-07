import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { HlmSkeleton } from '@spartan-ng/helm/skeleton';
import {
  HlmTBody,
  HlmTHead,
  HlmTable,
  HlmTableContainer,
  HlmTd,
  HlmTh,
  HlmTr,
} from '@spartan-ng/helm/table';
import { ClassAverageDto } from '../../api/generated/models';
import { ScoreBadge } from './score-badge';

/**
 * classLevel/average/examCount summary table shared by DashboardPage and the "class"
 * tab of ReportsPage - identical row markup in both, differing only in translation
 * keys (kept as inputs rather than unifying the keys, so no locale JSON changes needed).
 */
@Component({
  selector: 'app-class-averages-table',
  imports: [
    TranslatePipe,
    HlmSkeleton,
    HlmTableContainer,
    HlmTable,
    HlmTHead,
    HlmTBody,
    HlmTr,
    HlmTh,
    HlmTd,
    ScoreBadge,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div hlmTableContainer class="overflow-hidden rounded-xl border border-border">
      <table hlmTable>
        <thead hlmTHead>
          <tr hlmTr class="bg-brand-500 hover:bg-brand-500">
            <th hlmTh class="text-white">{{ classLevelLabelKey() | translate }}</th>
            <th hlmTh class="text-white">{{ averageLabelKey() | translate }}</th>
            <th hlmTh class="text-white">{{ examCountLabelKey() | translate }}</th>
          </tr>
        </thead>
        <tbody hlmTBody>
          @if (isLoading()) {
            @for (row of skeletonRows(); track row) {
              <tr hlmTr class="bg-white">
                <td hlmTd><div hlmSkeleton class="h-4 w-10"></div></td>
                <td hlmTd><div hlmSkeleton class="h-5 w-10 rounded-full"></div></td>
                <td hlmTd><div hlmSkeleton class="h-4 w-10"></div></td>
              </tr>
            }
          } @else if (rows().length === 0) {
            <tr hlmTr class="bg-white">
              <td hlmTd colspan="3" class="py-8 text-center text-ink-tertiary">
                {{ emptyMessageKey() | translate }}
              </td>
            </tr>
          } @else {
            @for (row of rows(); track row.classLevel) {
              <tr hlmTr class="bg-white">
                <td hlmTd>{{ row.classLevel }}</td>
                <td hlmTd><app-score-badge [score]="row.averageScore ?? 0" /></td>
                <td hlmTd>{{ row.examCount }}</td>
              </tr>
            }
          }
        </tbody>
      </table>
    </div>
  `,
})
export class ClassAveragesTable {
  readonly rows = input.required<readonly ClassAverageDto[]>();
  readonly isLoading = input(false);
  readonly classLevelLabelKey = input.required<string>();
  readonly averageLabelKey = input.required<string>();
  readonly examCountLabelKey = input.required<string>();
  readonly emptyMessageKey = input.required<string>();
  readonly skeletonRowCount = input(3);

  protected readonly skeletonRows = computed(() =>
    Array.from({ length: this.skeletonRowCount() }, (_, i) => i),
  );
}
