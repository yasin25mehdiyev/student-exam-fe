import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageTitleService } from '../core/layout/page-title.service';
import { RouteProgressBar } from '../shared/ui/custom/route-progress-bar';

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
  // Injected only to force eager instantiation of this root-singleton service - it has no
  // other consumer, so without this it would never start syncing the tab title.
  private readonly pageTitleService = inject(PageTitleService);
}
