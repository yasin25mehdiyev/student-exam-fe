import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter, startWith } from 'rxjs';

/**
 * Keeps the browser tab title in sync with the active route and language, reusing the same
 * `data.breadcrumb` translation key each route already carries for the breadcrumb trail
 * (see `Breadcrumb`) rather than duplicating a parallel `data.title` on every route.
 */
@Injectable({ providedIn: 'root' })
export class PageTitleService {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly translate = inject(TranslateService);
  private readonly titleService = inject(Title);

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        startWith(null),
      )
      .subscribe(() => this.updateTitle());

    this.translate.onLangChange.subscribe(() => this.updateTitle());
  }

  private updateTitle(): void {
    const breadcrumbKey = this.deepestBreadcrumbKey();
    const appName = this.translate.instant('common.appName');
    const pageTitle = breadcrumbKey ? this.translate.instant(breadcrumbKey) : undefined;
    this.titleService.setTitle(pageTitle ? `${pageTitle} — ${appName}` : appName);
  }

  private deepestBreadcrumbKey(): string | undefined {
    let node: ActivatedRoute | null = this.route.root;
    let key: string | undefined;

    while (node) {
      const child: ActivatedRoute | null = node.firstChild;
      // `child.snapshot` can briefly be unset if this runs mid-navigation (e.g. `onLangChange`
      // firing while the router is still activating the tree) - skip rather than throw, the
      // next `NavigationEnd`-triggered call will pick up the settled tree.
      if (child?.snapshot) {
        const breadcrumbKey = child.snapshot.data['breadcrumb'] as string | undefined;
        if (breadcrumbKey) {
          key = breadcrumbKey;
        }
      }
      node = child;
    }

    return key;
  }
}
