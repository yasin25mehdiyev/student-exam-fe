import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter, startWith } from 'rxjs';
import { collectBreadcrumbTrail } from '../../shared/lib/route-breadcrumb';

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
    const breadcrumbKey = collectBreadcrumbTrail(this.route).at(-1)?.labelKey;
    const appName = this.translate.instant('common.appName');
    const pageTitle = breadcrumbKey ? this.translate.instant(breadcrumbKey) : undefined;
    this.titleService.setTitle(pageTitle ? `${pageTitle} — ${appName}` : appName);
  }
}
