import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmField, HlmFieldError, HlmFieldLabel } from '@spartan-ng/helm/field';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import {
  HlmSelect,
  HlmSelectContent,
  HlmSelectItem,
  HlmSelectPortal,
  HlmSelectTrigger,
  HlmSelectValue,
} from '@spartan-ng/helm/select';
import { CourseDto, StudentDto } from '../../../shared/api/generated/models';
import { Exam } from '../data-access/exam.model';

export interface ExamFormValue {
  readonly courseCode: string;
  readonly studentNumber: number;
  readonly examDate: string;
  readonly score: number;
}

@Component({
  selector: 'app-exam-form',
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    HlmField,
    HlmFieldLabel,
    HlmFieldError,
    HlmInput,
    HlmButton,
    HlmSelect,
    HlmSelectTrigger,
    HlmSelectValue,
    HlmSelectContent,
    HlmSelectItem,
    HlmSelectPortal,
    HlmSpinner,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div
        class="flex flex-col gap-6 rounded-2xl bg-white p-8 shadow-[0px_2px_2px_rgba(0,0,0,0.08),0px_0px_1px_rgba(0,0,0,0.08)]"
      >
        <div class="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          @if (mode() === 'create') {
            <div hlmField>
              <label hlmFieldLabel for="courseCode">{{ 'exams.fields.course' | translate }}</label>
              <hlm-select
                [formControl]="form.controls.courseCode"
                [itemToString]="courseLabelFor"
                id="courseCode"
              >
                <hlm-select-trigger class="w-full">
                  <hlm-select-value [placeholder]="'exams.fields.coursePlaceholder' | translate" />
                </hlm-select-trigger>
                <hlm-select-content *hlmSelectPortal>
                  @for (course of courseOptions(); track course.code) {
                    <hlm-select-item [value]="course.code">
                      {{ course.code }} — {{ course.name }}
                    </hlm-select-item>
                  }
                </hlm-select-content>
              </hlm-select>
              <hlm-field-error>{{ 'exams.validation.required' | translate }}</hlm-field-error>
            </div>

            <div hlmField>
              <label hlmFieldLabel for="studentNumber">{{
                'exams.fields.student' | translate
              }}</label>
              <hlm-select
                [formControl]="form.controls.studentNumber"
                [itemToString]="studentLabelFor"
                id="studentNumber"
              >
                <hlm-select-trigger class="w-full">
                  <hlm-select-value [placeholder]="'exams.fields.studentPlaceholder' | translate" />
                </hlm-select-trigger>
                <hlm-select-content *hlmSelectPortal>
                  @for (student of studentOptions(); track student.number) {
                    <hlm-select-item [value]="student.number">
                      {{ student.number }} — {{ student.firstName }} {{ student.lastName }}
                    </hlm-select-item>
                  }
                </hlm-select-content>
              </hlm-select>
              <hlm-field-error>{{ 'exams.validation.required' | translate }}</hlm-field-error>
            </div>
          } @else {
            <div hlmField>
              <label hlmFieldLabel for="courseDisplay">{{
                'exams.fields.course' | translate
              }}</label>
              <input hlmInput id="courseDisplay" [value]="courseLabel()" disabled />
            </div>
            <div hlmField>
              <label hlmFieldLabel for="studentDisplay">{{
                'exams.fields.student' | translate
              }}</label>
              <input hlmInput id="studentDisplay" [value]="studentLabel()" disabled />
            </div>
          }

          <div hlmField>
            <label hlmFieldLabel for="examDate">{{ 'exams.fields.examDate' | translate }}</label>
            <input hlmInput id="examDate" type="date" [formControl]="form.controls.examDate" />
            <hlm-field-error>{{ 'exams.validation.required' | translate }}</hlm-field-error>
          </div>

          <div hlmField>
            <label hlmFieldLabel for="score">{{ 'exams.fields.score' | translate }}</label>
            <input
              hlmInput
              id="score"
              type="number"
              min="0"
              max="9"
              [formControl]="form.controls.score"
              [placeholder]="'exams.fields.scorePlaceholder' | translate"
            />
            <hlm-field-error>{{ 'exams.validation.scoreRange' | translate }}</hlm-field-error>
          </div>
        </div>

        <div class="flex justify-end gap-3 border-t border-wash pt-6">
          <button hlmBtn type="button" variant="outline" (click)="location.back()">
            {{ 'common.actions.cancel' | translate }}
          </button>
          <button hlmBtn type="submit" [disabled]="saving()" class="gap-1.5">
            @if (saving()) {
              <hlm-spinner />
            }
            {{ (isEdit() ? 'common.actions.save' : 'common.actions.create') | translate }}
          </button>
        </div>
      </div>
    </form>
  `,
})
export class ExamForm {
  protected readonly location = inject(Location);

  readonly mode = input<'create' | 'edit'>('create');
  readonly initialValue = input<Exam | null>(null);
  readonly saving = input(false);
  readonly courseOptions = input<readonly CourseDto[]>([]);
  readonly studentOptions = input<readonly StudentDto[]>([]);
  readonly save = output<ExamFormValue>();

  protected readonly isEdit = computed(() => this.mode() === 'edit');

  protected readonly courseLabel = () => {
    const value = this.initialValue();
    return value ? `${value.courseCode} — ${value.courseName}` : '';
  };

  protected readonly studentLabel = () => {
    const value = this.initialValue();
    return value ? `${value.studentNumber} — ${value.studentFullName}` : '';
  };

  protected readonly courseLabelFor = (code: string): string => {
    const course = this.courseOptions().find((c) => c.code === code);
    return course ? `${course.code} — ${course.name}` : code;
  };

  protected readonly studentLabelFor = (number: number): string => {
    const student = this.studentOptions().find((s) => s.number === number);
    return student ? `${student.number} — ${student.firstName} ${student.lastName}` : `${number}`;
  };

  protected readonly form = new FormGroup({
    courseCode: new FormControl<string | null>(null, { validators: [Validators.required] }),
    studentNumber: new FormControl<number | null>(null, { validators: [Validators.required] }),
    examDate: new FormControl(new Date().toISOString().slice(0, 10), {
      nonNullable: true,
      validators: [Validators.required],
    }),
    score: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0), Validators.max(9)],
    }),
  });

  constructor() {
    effect(() => {
      const value = this.initialValue();
      if (value) {
        this.form.patchValue({
          courseCode: value.courseCode ?? null,
          studentNumber: value.studentNumber ?? null,
          examDate: (value.examDate ?? '').slice(0, 10),
          score: value.score ?? 0,
        });
      }
    });
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    this.save.emit({
      courseCode: raw.courseCode ?? '',
      studentNumber: raw.studentNumber ?? 0,
      examDate: raw.examDate,
      score: raw.score,
    });
  }
}
