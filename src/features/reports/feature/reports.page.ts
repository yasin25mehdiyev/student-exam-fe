import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmField, HlmFieldLabel } from '@spartan-ng/helm/field';
import { HlmInput } from '@spartan-ng/helm/input';
import {
  HlmSelect,
  HlmSelectContent,
  HlmSelectItem,
  HlmSelectPortal,
  HlmSelectTrigger,
  HlmSelectValue,
} from '@spartan-ng/helm/select';
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
import { HlmTabs, HlmTabsContent, HlmTabsList, HlmTabsTrigger } from '@spartan-ng/helm/tabs';
import { ClassAveragesTable } from '../../../shared/ui/custom/class-averages-table';
import { ScoreBadge } from '../../../shared/ui/custom/score-badge';
import { PageHeader } from '../../../shared/ui/custom/page-header';
import { ReportDataAccess } from '../data-access/report.service';

@Component({
  selector: 'app-reports-page',
  imports: [
    FormsModule,
    DecimalPipe,
    TranslatePipe,
    HlmButton,
    HlmField,
    HlmFieldLabel,
    HlmInput,
    HlmSelect,
    HlmSelectTrigger,
    HlmSelectValue,
    HlmSelectContent,
    HlmSelectItem,
    HlmSelectPortal,
    HlmSkeleton,
    HlmTableContainer,
    HlmTable,
    HlmTHead,
    HlmTBody,
    HlmTr,
    HlmTh,
    HlmTd,
    HlmTabs,
    HlmTabsList,
    HlmTabsTrigger,
    HlmTabsContent,
    ScoreBadge,
    ClassAveragesTable,
    PageHeader,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-header
      [title]="'reports.title' | translate"
      [description]="'reports.pageDescription' | translate"
    />

    <hlm-tabs [tab]="activeTab()" (tabActivated)="activeTab.set($event)">
      <hlm-tabs-list>
        <button hlmTabsTrigger="student">{{ 'reports.tabs.studentReport' | translate }}</button>
        <button hlmTabsTrigger="class">{{ 'reports.tabs.classAverages' | translate }}</button>
      </hlm-tabs-list>

      <div hlmTabsContent="student" class="pt-4">
        <div
          class="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-[0px_2px_2px_rgba(0,0,0,0.08),0px_0px_1px_rgba(0,0,0,0.08)]"
        >
          <div class="flex max-w-sm items-end gap-2">
            <div hlmField class="flex-1">
              <label hlmFieldLabel for="studentNumberSearch">
                {{ 'reports.studentReport.searchLabel' | translate }}
              </label>
              <input
                hlmInput
                id="studentNumberSearch"
                type="number"
                [placeholder]="'reports.studentReport.searchPlaceholder' | translate"
                [(ngModel)]="studentNumberInput"
                (keyup.enter)="searchStudent()"
              />
            </div>
            <button hlmBtn (click)="searchStudent()">
              {{ 'reports.studentReport.search' | translate }}
            </button>
          </div>

          @if (studentReport.isLoading()) {
            <div hlmSkeleton class="h-32 w-full"></div>
          } @else if (studentNumber() !== undefined && !studentReport.hasValue()) {
            <p class="text-sm text-ink-tertiary">
              {{ 'reports.studentReport.notFound' | translate }}
            </p>
          } @else if (studentReport.hasValue()) {
            <div>
              <p class="text-lg font-medium text-foreground">
                {{ studentReport.value()!.fullName }}
              </p>
              <p class="text-sm text-muted-foreground">
                {{ 'reports.studentReport.average' | translate }}:
                @if (
                  studentReport.value()!.averageScore !== null &&
                  studentReport.value()!.averageScore !== undefined
                ) {
                  {{ studentReport.value()!.averageScore | number: '1.0-2' }}
                } @else {
                  —
                }
                · {{ 'reports.studentReport.examCount' | translate }}:
                {{ studentReport.value()!.exams?.length ?? 0 }}
              </p>
            </div>

            <div hlmTableContainer class="rounded-xl border border-border">
              <table hlmTable>
                <thead hlmTHead>
                  <tr hlmTr class="bg-brand-500 hover:bg-brand-500">
                    <th hlmTh class="text-white">{{
                      'reports.studentReport.columns.course' | translate
                    }}</th>
                    <th hlmTh class="text-white">{{
                      'reports.studentReport.columns.date' | translate
                    }}</th>
                    <th hlmTh class="text-white">{{
                      'reports.studentReport.columns.score' | translate
                    }}</th>
                  </tr>
                </thead>
                <tbody hlmTBody>
                  @if (!studentReport.value()!.exams?.length) {
                    <tr hlmTr class="bg-white">
                      <td hlmTd colspan="3" class="py-8 text-center text-ink-tertiary">
                        {{ 'reports.studentReport.empty' | translate }}
                      </td>
                    </tr>
                  } @else {
                    @for (exam of studentReport.value()!.exams!; track exam.id) {
                      <tr hlmTr class="bg-white">
                        <td hlmTd>{{ exam.courseCode }} — {{ exam.courseName }}</td>
                        <td hlmTd>{{ exam.examDate }}</td>
                        <td hlmTd><app-score-badge [score]="exam.score ?? 0" /></td>
                      </tr>
                    }
                  }
                </tbody>
              </table>
            </div>
          } @else {
            <p class="text-sm text-ink-tertiary">
              {{ 'reports.studentReport.prompt' | translate }}
            </p>
          }
        </div>
      </div>

      <div hlmTabsContent="class" class="pt-4">
        <div
          class="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-[0px_2px_2px_rgba(0,0,0,0.08),0px_0px_1px_rgba(0,0,0,0.08)]"
        >
          <div hlmField class="max-w-xs">
            <label hlmFieldLabel for="courseFilterSelect">
              {{ 'reports.classAverages.filterLabel' | translate }}
            </label>
            <hlm-select
              id="courseFilterSelect"
              [value]="courseFilter()"
              (valueChange)="courseFilter.set($event ?? '')"
            >
              <hlm-select-trigger class="w-full">
                <hlm-select-value />
              </hlm-select-trigger>
              <hlm-select-content *hlmSelectPortal>
                <hlm-select-item value="">{{
                  'reports.classAverages.allCourses' | translate
                }}</hlm-select-item>
                @for (course of courseOptions(); track course.code) {
                  <hlm-select-item [value]="course.code"
                    >{{ course.code }} — {{ course.name }}</hlm-select-item
                  >
                }
              </hlm-select-content>
            </hlm-select>
          </div>

          <app-class-averages-table
            [rows]="classAverages.value() ?? []"
            [isLoading]="classAverages.isLoading()"
            classLevelLabelKey="reports.classAverages.columns.classLevel"
            averageLabelKey="reports.classAverages.columns.average"
            examCountLabelKey="reports.classAverages.columns.examCount"
            emptyMessageKey="reports.classAverages.empty"
          />
        </div>
      </div>
    </hlm-tabs>
  `,
})
export class ReportsPage {
  private readonly data = inject(ReportDataAccess);

  protected readonly activeTab = signal<string>('student');

  protected studentNumberInput = '';
  protected readonly studentNumber = signal<number | undefined>(undefined);
  protected readonly studentReport = this.data.studentReport(this.studentNumber);

  protected readonly courseFilter = signal('');
  protected readonly classAverages = this.data.classAverages(this.courseFilter);
  protected readonly courseOptions = computed(() => this.data.courseOptions.value()?.items ?? []);

  constructor() {
    effect(() => {
      if (this.activeTab() === 'class') {
        this.data.activateClassAverages();
      }
    });
  }

  protected searchStudent(): void {
    const parsed = Number(this.studentNumberInput);
    this.studentNumber.set(Number.isFinite(parsed) && parsed > 0 ? parsed : undefined);
  }
}
