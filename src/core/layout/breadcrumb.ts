import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideLayoutDashboard } from '@ng-icons/lucide';
import { TranslatePipe } from '@ngx-translate/core';
import { filter, startWith } from 'rxjs';
import { ROUTE_PATHS } from '../../shared/lib/route-paths';
import { collectBreadcrumbTrail } from '../../shared/lib/route-breadcrumb';

@Component({
  selector: 'app-breadcrumb',
  imports: [RouterLink, TranslatePipe, NgIcon],
  providers: [provideIcons({ lucideLayoutDashboard, lucideChevronRight })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex shrink-0 items-center gap-1.5">
      <a [routerLink]="routePaths.dashboard">
        <div class="flex size-5 items-center justify-center rounded bg-wash">
          <ng-icon name="lucideLayoutDashboard" size="12" class="text-brand-500" />
        </div>
      </a>

      @for (crumb of crumbs(); track $index; let last = $last) {
        <div class="flex items-center gap-1.5">
          <ng-icon name="lucideChevronRight" size="14" class="text-ink-tertiary" />
          @if (last) {
            <span class="text-sm font-medium text-foreground">{{ crumb.labelKey | translate }}</span>
          } @else {
            <a
              [routerLink]="crumb.url"
              class="text-sm text-muted-foreground hover:text-foreground"
              >{{ crumb.labelKey | translate }}</a
            >
          }
        </div>
      }
    </div>
  `,
})
export class Breadcrumb {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly routePaths = ROUTE_PATHS;

  private readonly navigationTrigger = signal(0);

  protected readonly crumbs = computed(() => {
    this.navigationTrigger();
    return collectBreadcrumbTrail(this.route);
  });

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        startWith(null),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.navigationTrigger.update((value) => value + 1));
  }
}
