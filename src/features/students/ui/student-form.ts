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
import { Student } from '../data-access/student.model';

export interface StudentFormValue {
  readonly number: number;
  readonly firstName: string;
  readonly lastName: string;
  readonly classLevel: number;
}

@Component({
  selector: 'app-student-form',
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
            <label hlmFieldLabel for="number">{{ 'students.fields.number' | translate }}</label>
            <input
              hlmInput
              id="number"
              type="number"
              min="1"
              max="99999"
              [formControl]="form.controls.number"
              [placeholder]="'students.fields.numberPlaceholder' | translate"
            />
            <hlm-field-error>{{ 'students.validation.numberRange' | translate }}</hlm-field-error>
          </div>

          <div hlmField>
            <label hlmFieldLabel for="firstName">{{
              'students.fields.firstName' | translate
            }}</label>
            <input
              hlmInput
              id="firstName"
              [formControl]="form.controls.firstName"
              maxlength="30"
              [placeholder]="'students.fields.firstNamePlaceholder' | translate"
            />
            <hlm-field-error>{{ 'students.validation.required' | translate }}</hlm-field-error>
          </div>

          <div hlmField>
            <label hlmFieldLabel for="lastName">{{ 'students.fields.lastName' | translate }}</label>
            <input
              hlmInput
              id="lastName"
              [formControl]="form.controls.lastName"
              maxlength="30"
              [placeholder]="'students.fields.lastNamePlaceholder' | translate"
            />
            <hlm-field-error>{{ 'students.validation.required' | translate }}</hlm-field-error>
          </div>

          <div hlmField>
            <label hlmFieldLabel for="classLevel">{{
              'students.fields.classLevel' | translate
            }}</label>
            <input
              hlmInput
              id="classLevel"
              type="number"
              min="1"
              max="11"
              [formControl]="form.controls.classLevel"
              [placeholder]="'students.fields.classLevelPlaceholder' | translate"
            />
            <hlm-field-error>{{ 'students.validation.classLevelRange' | translate }}</hlm-field-error>
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
export class StudentForm {
  protected readonly location = inject(Location);

  readonly mode = input<'create' | 'edit'>('create');
  readonly initialValue = input<Student | null>(null);
  readonly saving = input(false);
  readonly save = output<StudentFormValue>();

  protected readonly form = new FormGroup({
    number: new FormControl(1, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1), Validators.max(99999)],
    }),
    firstName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(30)],
    }),
    lastName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(30)],
    }),
    classLevel: new FormControl(1, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1), Validators.max(11)],
    }),
  });

  protected readonly isEdit = computed(() => this.mode() === 'edit');

  constructor() {
    effect(() => {
      const value = this.initialValue();
      if (value) {
        this.form.patchValue({
          number: value.number ?? 1,
          firstName: value.firstName ?? '',
          lastName: value.lastName ?? '',
          classLevel: value.classLevel ?? 1,
        });
      }
      if (this.isEdit()) {
        this.form.controls.number.disable();
      } else {
        this.form.controls.number.enable();
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
