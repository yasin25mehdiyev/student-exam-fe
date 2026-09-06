import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Type, inject, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideChevronDown } from '@ng-icons/lucide';
import {
  HlmDropdownMenu,
  HlmDropdownMenuItem,
  HlmDropdownMenuTrigger,
} from '@spartan-ng/helm/dropdown-menu';
import { FlagAz, FlagGb, FlagRu } from '../../shared/icons/flags';
import { SupportedLocale } from '../../shared/i18n/config';
import { LocaleService } from '../../shared/i18n/locale.service';

interface LocaleOption {
  readonly code: SupportedLocale;
  readonly label: string;
  readonly flag: Type<unknown>;
}

const LOCALE_OPTIONS: readonly LocaleOption[] = [
  { code: 'az', label: 'Azərbaycan', flag: FlagAz },
  { code: 'en', label: 'English', flag: FlagGb },
  { code: 'ru', label: 'Русский', flag: FlagRu },
];

@Component({
  selector: 'app-language-switcher',
  imports: [NgIcon, NgComponentOutlet, HlmDropdownMenu, HlmDropdownMenuItem, HlmDropdownMenuTrigger],
  providers: [provideIcons({ lucideCheck, lucideChevronDown })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full py-1 pr-3 pl-1.5 text-sm hover:bg-wash"
      [hlmDropdownMenuTrigger]="menu"
      (hlmDropdownMenuOpened)="open.set(true)"
      (hlmDropdownMenuClosed)="open.set(false)"
    >
      <span class="flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-outline">
        <ng-container [ngComponentOutlet]="current().flag" />
      </span>
      <span class="font-medium text-foreground">{{ current().code.toUpperCase() }}</span>
      <ng-icon
        name="lucideChevronDown"
        size="16"
        class="text-muted-foreground transition-transform"
        [class.rotate-180]="open()"
      />
    </button>

    <ng-template #menu>
      <div hlmDropdownMenu class="w-44 min-w-0 p-1">
        @for (option of locales; track option.code) {
          <button
            hlmDropdownMenuItem
            (triggered)="localeService.setLocale(option.code)"
            [class]="
              'cursor-pointer gap-1.5 px-1.5' +
              (option.code === current().code ? ' bg-brand-100/30 text-brand-500' : '')
            "
          >
            <span class="flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-outline">
              <ng-container [ngComponentOutlet]="option.flag" />
            </span>
            <span class="flex-1 truncate text-inherit">{{ option.label }}</span>
            @if (option.code === current().code) {
              <ng-icon name="lucideCheck" size="16" class="shrink-0 text-brand-500" />
            }
          </button>
        }
      </div>
    </ng-template>
  `,
})
export class LanguageSwitcher {
  protected readonly localeService = inject(LocaleService);
  protected readonly locales = LOCALE_OPTIONS;
  protected readonly open = signal(false);

  protected current(): LocaleOption {
    return (
      LOCALE_OPTIONS.find((option) => option.code === this.localeService.current()) ??
      LOCALE_OPTIONS[0]
    );
  }
}
