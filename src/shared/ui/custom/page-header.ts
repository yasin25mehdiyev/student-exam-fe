import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft } from '@ng-icons/lucide';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-page-header',
  imports: [NgIcon, TranslatePipe],
  providers: [provideIcons({ lucideArrowLeft })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mb-6 flex items-center gap-3">
      <button
        type="button"
        (click)="location.back()"
        [attr.aria-label]="'common.actions.back' | translate"
        class="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white hover:bg-white/90"
      >
        <ng-icon name="lucideArrowLeft" size="18" />
      </button>

      <div>
        <h1 class="text-2xl font-semibold text-foreground">{{ title() }}</h1>
        @if (description()) {
          <p class="mt-1 text-sm text-muted-foreground">{{ description() }}</p>
        }
      </div>
    </div>
  `,
})
export class PageHeader {
  protected readonly location = inject(Location);

  readonly title = input.required<string>();
  readonly description = input<string>();
}
