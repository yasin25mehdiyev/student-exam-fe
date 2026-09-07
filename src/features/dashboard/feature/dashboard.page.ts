import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideClipboardList, lucideGraduationCap, lucideNotebookText } from '@ng-icons/lucide';
import { TranslatePipe } from '@ngx-translate/core';
import { HlmSkeleton } from '@spartan-ng/helm/skeleton';
import { ReportService as ReportApi } from '../../../shared/api/generated/report/report.service';
import { smoothLoading } from '../../../shared/lib/smooth-loading';
import { ClassAveragesTable } from '../../../shared/ui/custom/class-averages-table';
import { PageHeader } from '../../../shared/ui/custom/page-header';

@Component({
  selector: 'app-dashboard-page',
  imports: [TranslatePipe, NgIcon, HlmSkeleton, ClassAveragesTable, PageHeader],
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

      <app-class-averages-table
        [rows]="classAverages.value() ?? []"
        [isLoading]="classAveragesLoading()"
        classLevelLabelKey="dashboard.columns.classLevel"
        averageLabelKey="dashboard.columns.average"
        examCountLabelKey="dashboard.columns.examCount"
        emptyMessageKey="dashboard.empty"
      />
    </div>
  `,
})
export class DashboardPage {
  private readonly reportApi = inject(ReportApi);

  protected readonly summary = rxResource({
    stream: () => this.reportApi.getSummary('application/json'),
  });

  protected readonly classAverages = rxResource({
    stream: () => this.reportApi.getClassAverages('application/json', {}),
  });

  protected readonly summaryLoading = smoothLoading(this.summary.isLoading);
  protected readonly classAveragesLoading = smoothLoading(this.classAverages.isLoading);
}
