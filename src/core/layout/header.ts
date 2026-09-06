import { ChangeDetectionStrategy, Component, computed, inject, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCalendarDays, lucideMenu } from '@ng-icons/lucide';
import { TranslatePipe } from '@ngx-translate/core';
import { SupportedLocale } from '../../shared/i18n/config';
import { LocaleService } from '../../shared/i18n/locale.service';
import { Logo } from '../../shared/icons/logo';
import { LanguageSwitcher } from './language-switcher';
import { ProfileMenu } from './profile-menu';

// Chromium/Node's bundled ICU data doesn't reliably ship month names for the 'az' locale
// (falls back to a "2026 M09 5"-style skeleton), so today's date is formatted manually
// rather than trusting `Intl.DateTimeFormat` for every supported locale.
const MONTH_NAMES: Record<SupportedLocale, readonly string[]> = {
  az: [
    'yanvar',
    'fevral',
    'mart',
    'aprel',
    'may',
    'iyun',
    'iyul',
    'avqust',
    'sentyabr',
    'oktyabr',
    'noyabr',
    'dekabr',
  ],
  en: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  ru: [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ],
};

// Exported so the mobile sidebar drawer's profile row (matching client's mobile sidebar header,
// which shows the date next to the user's name/email) can reuse the same formatting.
export function formatToday(locale: SupportedLocale): string {
  const today = new Date();
  return `${today.getDate()} ${MONTH_NAMES[locale][today.getMonth()]} ${today.getFullYear()}`;
}

@Component({
  selector: 'app-header',
  imports: [NgIcon, Logo, TranslatePipe, LanguageSwitcher, ProfileMenu],
  providers: [provideIcons({ lucideCalendarDays, lucideMenu })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="flex h-11 w-full shrink-0 items-center justify-between gap-2 md:justify-end">
      <app-logo class="md:hidden" />

      <div class="ml-auto flex items-center gap-1 rounded-full bg-white p-1 md:hidden">
        <button
          type="button"
          (click)="openMobileNav.emit()"
          [attr.aria-label]="'nav.sidebar.openMenu' | translate"
          class="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-wash hover:bg-wash"
        >
          <ng-icon name="lucideMenu" size="18" />
        </button>
      </div>

      <div class="ml-auto hidden items-center gap-1 rounded-full bg-white p-1 md:flex">
        <div class="hidden items-center gap-1 rounded-full bg-wash px-3 py-1 sm:flex">
          <ng-icon name="lucideCalendarDays" size="16" class="text-secondary-brand" />
          <span class="text-sm text-secondary-brand">{{ today() }}</span>
        </div>

        <app-language-switcher />

        <app-profile-menu />
      </div>
    </header>
  `,
})
export class Header {
  private readonly localeService = inject(LocaleService);

  protected readonly today = computed(() => formatToday(this.localeService.current()));

  readonly openMobileNav = output<void>();
}
