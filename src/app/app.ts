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
  private readonly localeService = inject(LocaleService);
  private readonly pageTitleService = inject(PageTitleService);
}
