import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmField, HlmFieldError, HlmFieldLabel } from '@spartan-ng/helm/field';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import { Course } from '../data-access/course.model';

export interface CourseFormValue {
  readonly code: string;
  readonly name: string;
  readonly classLevel: number;
  readonly teacherFirstName: string;
  readonly teacherLastName: string;
}

@Component({
  selector: 'app-course-form',
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    HlmField,
    HlmFieldLabel,
    HlmFieldError,
    HlmInput,
    HlmButton,
    HlmSpinner,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div
        class="flex flex-col gap-6 rounded-2xl bg-white p-8 shadow-[0px_2px_2px_rgba(0,0,0,0.08),0px_0px_1px_rgba(0,0,0,0.08)]"
      >
        <div class="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div hlmField>
            <label hlmFieldLabel for="code">{{ 'courses.fields.code' | translate }}</label>
            <input
              hlmInput
              id="code"
              [formControl]="form.controls.code"
              maxlength="3"
              [placeholder]="'courses.fields.codePlaceholder' | translate"
            />
            <hlm-field-error>{{ 'courses.validation.codeLength' | translate }}</hlm-field-error>
          </div>

          <div hlmField>
            <label hlmFieldLabel for="name">{{ 'courses.fields.name' | translate }}</label>
            <input
              hlmInput
              id="name"
              [formControl]="form.controls.name"
              maxlength="30"
              [placeholder]="'courses.fields.namePlaceholder' | translate"
            />
            <hlm-field-error>{{ 'courses.validation.required' | translate }}</hlm-field-error>
          </div>

          <div hlmField>
            <label hlmFieldLabel for="classLevel">{{
              'courses.fields.classLevel' | translate
            }}</label>
            <input
              hlmInput
              id="classLevel"
              type="number"
              min="1"
              max="11"
              [formControl]="form.controls.classLevel"
              [placeholder]="'courses.fields.classLevelPlaceholder' | translate"
            />
            <hlm-field-error>{{ 'courses.validation.classLevelRange' | translate }}</hlm-field-error>
          </div>

          <div hlmField>
            <label hlmFieldLabel for="teacherFirstName">{{
              'courses.fields.teacherFirstName' | translate
            }}</label>
            <input
              hlmInput
              id="teacherFirstName"
              [formControl]="form.controls.teacherFirstName"
              maxlength="20"
              [placeholder]="'courses.fields.teacherFirstNamePlaceholder' | translate"
            />
            <hlm-field-error>{{ 'courses.validation.required' | translate }}</hlm-field-error>
          </div>

          <div hlmField>
            <label hlmFieldLabel for="teacherLastName">{{
              'courses.fields.teacherLastName' | translate
            }}</label>
            <input
              hlmInput
              id="teacherLastName"
              [formControl]="form.controls.teacherLastName"
              maxlength="20"
              [placeholder]="'courses.fields.teacherLastNamePlaceholder' | translate"
            />
            <hlm-field-error>{{ 'courses.validation.required' | translate }}</hlm-field-error>
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
export class CourseForm {
  protected readonly location = inject(Location);

  readonly mode = input<'create' | 'edit'>('create');
  readonly initialValue = input<Course | null>(null);
  readonly saving = input(false);
  readonly save = output<CourseFormValue>();

  protected readonly form = new FormGroup({
    code: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(3)],
    }),
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(30)],
    }),
    classLevel: new FormControl(1, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1), Validators.max(11)],
    }),
    teacherFirstName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(20)],
    }),
    teacherLastName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(20)],
    }),
  });

  protected readonly isEdit = computed(() => this.mode() === 'edit');

  constructor() {
    effect(() => {
      const value = this.initialValue();
      if (value) {
        this.form.patchValue({
          code: value.code ?? '',
          name: value.name ?? '',
          classLevel: value.classLevel ?? 1,
          teacherFirstName: value.teacherFirstName ?? '',
          teacherLastName: value.teacherLastName ?? '',
        });
      }
      if (this.isEdit()) {
        this.form.controls.code.disable();
      } else {
        this.form.controls.code.enable();
      }
    });
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.save.emit(this.form.getRawValue());
  }
}
