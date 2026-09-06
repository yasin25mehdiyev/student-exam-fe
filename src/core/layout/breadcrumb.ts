import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideLayoutDashboard } from '@ng-icons/lucide';
import { TranslatePipe } from '@ngx-translate/core';
import { filter, startWith } from 'rxjs';

interface Crumb {
  readonly labelKey: string;
  readonly url: string;
}

@Component({
  selector: 'app-breadcrumb',
  imports: [RouterLink, TranslatePipe, NgIcon],
  providers: [provideIcons({ lucideLayoutDashboard, lucideChevronRight })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex shrink-0 items-center gap-1.5">
      <a routerLink="/">
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

  private readonly navigationTrigger = signal(0);

  protected readonly crumbs = computed(() => {
    this.navigationTrigger();
    return this.buildCrumbs();
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

  private buildCrumbs(): Crumb[] {
    const crumbs: Crumb[] = [];
    let node: ActivatedRoute | null = this.route.root;
    let url = '';

    while (node) {
      const child: ActivatedRoute | null = node.firstChild;
      if (child) {
        const segments = child.snapshot.url.map((segment: { path: string }) => segment.path);
        if (segments.length > 0) {
          url += `/${segments.join('/')}`;
        }
        const breadcrumbKey = child.snapshot.data['breadcrumb'] as string | undefined;
        if (breadcrumbKey) {
          crumbs.push({ labelKey: breadcrumbKey, url: url || '/' });
        }
      }
      node = child;
    }

    // An empty-path index route (e.g. `courses` -> `''`) inherits its parent's route
    // `data` by default (Angular's emptyOnly param/data inheritance), so it re-asserts
    // the same breadcrumb the parent already contributed. Collapse those consecutive
    // duplicates rather than special-casing empty-path segments above, which would
    // also wrongly swallow genuine top-level `''` routes like the dashboard.
    return crumbs.filter((crumb, index) => crumb.url !== crumbs[index - 1]?.url);
  }
}
