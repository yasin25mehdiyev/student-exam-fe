import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageTitleService } from '../core/layout/page-title.service';
import { RouteProgressBar } from '../shared/ui/custom/route-progress-bar';
import { LocaleService } from '../shared/i18n/locale.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouteProgressBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-route-progress-bar />
    <router-outlet />
  `,
})
export class App {
  // Injected here (not in `Shell`) so the persisted/default locale is applied before the router
  // activates ANY route component - including the standalone not-found page, which sits outside
  // `Shell` and would otherwise never trigger this. Also avoids `LocaleService` (and the
  // `onLangChange` it fires) running mid-navigation, which raced `PageTitleService` walking a
  // not-yet-fully-activated route tree.
  private readonly localeService = inject(LocaleService);

  // Injected only to trigger initialization (starts syncing the tab title with the active
  // route/language) as soon as the app mounts.
  private readonly pageTitleService = inject(PageTitleService);
}
