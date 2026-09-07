import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideChartBar,
  lucideChevronLeft,
  lucideClipboardList,
  lucideGraduationCap,
  lucideHeadset,
  lucideLayoutDashboard,
  lucideMail,
  lucideNotebookText,
  lucidePhone,
  lucideUser,
  lucideX,
} from '@ng-icons/lucide';
import { TranslatePipe } from '@ngx-translate/core';
import { HlmAvatar, HlmAvatarFallback, HlmAvatarImage } from '@spartan-ng/helm/avatar';
import { HlmTooltip } from '@spartan-ng/helm/tooltip';
import { Logo } from '../../shared/icons/logo';
import { LocaleService } from '../../shared/i18n/locale.service';
import { ROUTE_PATHS } from '../../shared/lib/route-paths';
import { formatToday } from './header';
import { LanguageSwitcher } from '../../shared/ui/custom/language-switcher';
import { PROFILE } from '../../shared/ui/custom/profile-menu';

interface NavItem {
  readonly labelKey: string;
  readonly path: string;
  readonly icon: string;
}

const NAV_ITEMS: readonly NavItem[] = [
  { labelKey: 'nav.dashboard', path: ROUTE_PATHS.dashboard, icon: 'lucideLayoutDashboard' },
  { labelKey: 'nav.courses', path: ROUTE_PATHS.courses, icon: 'lucideNotebookText' },
  { labelKey: 'nav.students', path: ROUTE_PATHS.students, icon: 'lucideGraduationCap' },
  { labelKey: 'nav.exams', path: ROUTE_PATHS.exams, icon: 'lucideClipboardList' },
  { labelKey: 'nav.reports', path: ROUTE_PATHS.reports, icon: 'lucideChartBar' },
];

const SIDEBAR_BASE_CLASSES =
  'fixed inset-y-0 left-0 z-50 flex h-full w-full shrink-0 flex-col bg-white transition-transform duration-300 md:sticky md:inset-auto md:top-0 md:h-auto md:translate-x-0 md:gap-4 md:rounded-3xl md:shadow-[0px_10px_12.5px_0px_rgba(0,61,143,0.1)]';

@Component({
  selector: 'app-sidebar-nav',
  imports: [
    RouterLink,
    RouterLinkActive,
    NgIcon,
    TranslatePipe,
    Logo,
    HlmTooltip,
    HlmAvatar,
    HlmAvatarImage,
    HlmAvatarFallback,
    LanguageSwitcher,
  ],
  providers: [
    provideIcons({
      lucideLayoutDashboard,
      lucideNotebookText,
      lucideGraduationCap,
      lucideClipboardList,
      lucideChartBar,
      lucideChevronLeft,
      lucideHeadset,
      lucidePhone,
      lucideMail,
      lucideUser,
      lucideX,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
  },
  template: `
    <!-- Mobile-only drawer header: profile + language switcher + close button. Hidden at md+,
         where the header's own profile menu/language switcher take over. -->
    <div class="flex shrink-0 items-center justify-between gap-2 border-b border-wash p-4 md:hidden">
      <div class="flex min-w-0 items-center gap-2">
        <hlm-avatar>
          <img hlmAvatarImage [src]="profile.avatarUrl" [alt]="profile.name" />
          <span hlmAvatarFallback><ng-icon name="lucideUser" size="16" /></span>
        </hlm-avatar>
        <div class="flex min-w-0 flex-col">
          <span class="truncate text-sm font-medium text-foreground">{{ profile.name }}</span>
          <span class="truncate text-xs text-muted-foreground">{{ profile.email }} · {{ today() }}</span>
        </div>
      </div>
      <div class="flex shrink-0 items-center gap-3">
        <app-language-switcher />
        <button
          type="button"
          (click)="mobileOpenChange.emit(false)"
          [attr.aria-label]="'nav.sidebar.closeMenu' | translate"
          class="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-wash hover:bg-wash"
        >
          <ng-icon name="lucideX" size="18" />
        </button>
      </div>
    </div>

    <div
      class="hidden w-full shrink-0 items-center pt-2 pb-1 md:flex"
      [class.justify-center]="effectiveCollapsed()"
    >
      <app-logo />
      @if (!effectiveCollapsed()) {
        <span class="ml-2 truncate text-sm font-semibold text-foreground">{{
          'common.appName' | translate
        }}</span>
      }
    </div>

    <nav class="flex w-full flex-1 flex-col gap-1 overflow-y-auto p-4 md:p-0">
      @for (item of items; track item.path) {
        <a
          [routerLink]="item.path"
          routerLinkActive
          #rla="routerLinkActive"
          [routerLinkActiveOptions]="{ exact: item.path === '/' }"
          [attr.aria-label]="effectiveCollapsed() ? (item.labelKey | translate) : null"
          [hlmTooltip]="item.labelKey | translate"
          [tooltipDisabled]="!effectiveCollapsed()"
          position="right"
          class="flex h-11 shrink-0 cursor-pointer items-center gap-2 rounded-full px-4 py-3 text-sm leading-5 whitespace-nowrap text-foreground transition-colors hover:bg-wash hover:text-brand-500 [&_ng-icon]:shrink-0 [&_ng-icon]:text-ink-tertiary"
          [class.justify-center]="effectiveCollapsed()"
          [class.px-0]="effectiveCollapsed()"
          [class]="
            rla.isActive
              ? 'bg-brand-100/40 font-medium text-brand-500 shadow-[0px_1px_3px_0px_rgba(6,42,126,0.13)] [&_ng-icon]:text-brand-500'
              : ''
          "
        >
          <ng-icon [name]="item.icon" size="18" />
          @if (!effectiveCollapsed()) {
            <span class="min-w-0 flex-1 truncate text-left">{{ item.labelKey | translate }}</span>
          }
        </a>
      }
    </nav>

    @if (!effectiveCollapsed()) {
      <div class="flex w-full shrink-0 flex-col gap-3 px-4 pb-4 md:p-0">
        <div class="flex w-full shrink-0 flex-col gap-3 rounded-xl bg-wash px-3 py-3">
          <div class="flex items-center gap-2 text-sm leading-5 font-medium text-secondary-brand">
            <ng-icon name="lucideHeadset" size="18" class="shrink-0" />
            <span class="truncate">{{ 'nav.sidebar.support' | translate }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <a
              [href]="'tel:' + ('nav.sidebar.phone' | translate).replaceAll(' ', '')"
              class="flex items-center gap-2 rounded-lg px-2 py-1 text-xs leading-4 text-muted-foreground hover:bg-white"
            >
              <ng-icon name="lucidePhone" size="14" class="shrink-0" />
              <span class="truncate">{{ 'nav.sidebar.phone' | translate }}</span>
            </a>
            <a
              [href]="'mailto:' + ('nav.sidebar.email' | translate)"
              class="flex items-center gap-2 rounded-lg px-2 py-1 text-xs leading-4 text-muted-foreground hover:bg-white"
            >
              <ng-icon name="lucideMail" size="14" class="shrink-0" />
              <span class="truncate">{{ 'nav.sidebar.email' | translate }}</span>
            </a>
          </div>
        </div>
      </div>
    }

    <button
      type="button"
      (click)="toggleCollapsed()"
      [attr.aria-label]="
        (effectiveCollapsed() ? 'nav.sidebar.expand' : 'nav.sidebar.collapse') | translate
      "
      class="absolute top-[29px] hidden size-[29px] cursor-pointer items-center justify-center rounded-xl bg-white text-foreground shadow-[0px_2px_2px_0px_rgba(0,0,0,0.08),0px_0px_1px_0px_rgba(0,0,0,0.08)] hover:bg-wash md:flex"
      [class.right-5]="!effectiveCollapsed()"
      [style.right.px]="effectiveCollapsed() ? -6 : null"
    >
      <ng-icon
        name="lucideChevronLeft"
        size="18"
        class="transition-transform"
        [class.rotate-180]="effectiveCollapsed()"
      />
    </button>
  `,
})
export class SidebarNav {
  protected readonly items = NAV_ITEMS;
  protected readonly profile = PROFILE;

  private readonly localeService = inject(LocaleService);
  protected readonly today = computed(() => formatToday(this.localeService.current()));

  readonly mobileOpen = input(false);
  readonly mobileOpenChange = output<boolean>();

  protected readonly collapsed = signal(false);

  private readonly isDesktopViewport = signal(
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 768px)').matches : true,
  );

  protected readonly effectiveCollapsed = computed(() => this.collapsed() && this.isDesktopViewport());

  protected readonly hostClasses = computed(() => {
    const widthClass = this.effectiveCollapsed()
      ? 'md:w-[84px] md:items-center md:p-3'
      : 'md:w-[280px] md:p-5';
    const translateClass = this.mobileOpen() ? 'translate-x-0' : '-translate-x-full';
    return `${SIDEBAR_BASE_CLASSES} ${translateClass} ${widthClass}`;
  });

  constructor() {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const listener = (event: MediaQueryListEvent) => this.isDesktopViewport.set(event.matches);
    mediaQuery.addEventListener('change', listener);
    inject(DestroyRef).onDestroy(() => mediaQuery.removeEventListener('change', listener));
  }

  protected toggleCollapsed(): void {
    this.collapsed.update((value) => !value);
  }
}
