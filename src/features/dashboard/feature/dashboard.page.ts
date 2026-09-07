import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideClipboardList, lucideGraduationCap, lucideNotebookText } from '@ng-icons/lucide';
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
import { ReportService as ReportApi } from '../../../shared/api/generated/report/report.service';
import { smoothLoading } from '../../../shared/lib/smooth-loading';
import { PageHeader } from '../../../shared/ui/custom/page-header';
import { ScoreBadge } from '../../../shared/ui/custom/score-badge';

@Component({
  selector: 'app-dashboard-page',
  imports: [
    TranslatePipe,
    NgIcon,
    HlmSkeleton,
    HlmTableContainer,
    HlmTable,
    HlmTHead,
    HlmTBody,
    HlmTr,
    HlmTh,
    HlmTd,
    ScoreBadge,
    PageHeader,
  ],
  providers: [provideIcons({ lucideNotebookText, lucideGraduationCap, lucideClipboardList })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-header
      [title]="'nav.dashboard' | translate"
      [description]="'dashboard.pageDescription' | translate"
    />

    <div class="grid grid-cols-1 gap-4 pb-4 sm:grid-cols-3">
      <div class="rounded-2xl bg-white p-6 shadow-[0px_2px_2px_rgba(0,0,0,0.08),0px_0px_1px_rgba(0,0,0,0.08)]">
        <div class="flex items-center gap-2">
          <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-wash">
            <ng-icon name="lucideNotebookText" size="16" class="text-muted-foreground" />
          </span>
          <span class="text-sm text-muted-foreground">{{ 'dashboard.stats.courses' | translate }}</span>
        </div>
        @if (summaryLoading()) {
          <div hlmSkeleton class="mt-3 h-9 w-16"></div>
        } @else {
          <p class="mt-1 text-2xl font-semibold text-foreground">{{ summary.value()?.totalCourses ?? 0 }}</p>
        }
      </div>

      <div class="rounded-2xl bg-white p-6 shadow-[0px_2px_2px_rgba(0,0,0,0.08),0px_0px_1px_rgba(0,0,0,0.08)]">
        <div class="flex items-center gap-2">
          <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-wash">
            <ng-icon name="lucideGraduationCap" size="16" class="text-muted-foreground" />
          </span>
          <span class="text-sm text-muted-foreground">{{ 'dashboard.stats.students' | translate }}</span>
        </div>
        @if (summaryLoading()) {
          <div hlmSkeleton class="mt-3 h-9 w-16"></div>
        } @else {
          <p class="mt-1 text-2xl font-semibold text-foreground">{{ summary.value()?.totalStudents ?? 0 }}</p>
        }
      </div>

      <div class="rounded-2xl bg-white p-6 shadow-[0px_2px_2px_rgba(0,0,0,0.08),0px_0px_1px_rgba(0,0,0,0.08)]">
        <div class="flex items-center gap-2">
          <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-wash">
            <ng-icon name="lucideClipboardList" size="16" class="text-muted-foreground" />
          </span>
          <span class="text-sm text-muted-foreground">{{ 'dashboard.stats.exams' | translate }}</span>
        </div>
        @if (summaryLoading()) {
          <div hlmSkeleton class="mt-3 h-9 w-16"></div>
        } @else {
          <p class="mt-1 text-2xl font-semibold text-foreground">{{ summary.value()?.totalExams ?? 0 }}</p>
        }
      </div>
    </div>

    <div class="rounded-2xl bg-white p-6 shadow-[0px_2px_2px_rgba(0,0,0,0.08),0px_0px_1px_rgba(0,0,0,0.08)]">
      <h3 class="mb-4 text-base font-semibold text-foreground">
        {{ 'dashboard.classAverages' | translate }}
      </h3>

      <div hlmTableContainer class="overflow-hidden rounded-xl border border-border">
        <table hlmTable>
          <thead hlmTHead>
            <tr hlmTr class="bg-brand-500 hover:bg-brand-500">
              <th hlmTh class="text-white">{{ 'dashboard.columns.classLevel' | translate }}</th>
              <th hlmTh class="text-white">{{ 'dashboard.columns.average' | translate }}</th>
              <th hlmTh class="text-white">{{ 'dashboard.columns.examCount' | translate }}</th>
            </tr>
          </thead>
          <tbody hlmTBody>
            @if (classAveragesLoading()) {
              @for (row of skeletonRows; track row) {
                <tr hlmTr class="bg-white">
                  <td hlmTd><div hlmSkeleton class="h-4 w-10"></div></td>
                  <td hlmTd><div hlmSkeleton class="h-5 w-10 rounded-full"></div></td>
                  <td hlmTd><div hlmSkeleton class="h-4 w-10"></div></td>
                </tr>
              }
            } @else if (!classAverages.value()?.length) {
              <tr hlmTr class="bg-white">
                <td hlmTd colspan="3" class="py-8 text-center text-ink-tertiary">
                  {{ 'dashboard.empty' | translate }}
                </td>
              </tr>
            } @else {
              @for (row of classAverages.value()!; track row.classLevel) {
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
    </div>
  `,
})
export class DashboardPage {
  private readonly reportApi = inject(ReportApi);

  protected readonly summary = rxResource({
    stream: () => this.reportApi.getSummary('application/json'),
  });

  protected readonly courseFilter = signal('');
  protected readonly classAverages = rxResource({
    params: () => this.courseFilter(),
    stream: ({ params }) =>
      this.reportApi.getClassAverages('application/json', { courseCode: params || undefined }),
  });

  protected readonly skeletonRows = Array.from({ length: 3 }, (_, i) => i);

  protected readonly summaryLoading = smoothLoading(this.summary.isLoading);
  protected readonly classAveragesLoading = smoothLoading(this.classAverages.isLoading);
}
