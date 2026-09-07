import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTriangleAlert } from '@ng-icons/lucide';
import { TranslatePipe } from '@ngx-translate/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { ROUTE_PATHS } from '../../shared/lib/route-paths';

@Component({
  selector: 'app-error-page',
  imports: [RouterLink, TranslatePipe, HlmButton, NgIcon],
  providers: [provideIcons({ lucideTriangleAlert })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-1 flex-col items-center justify-center gap-3 py-24 text-center">
      <div class="flex size-16 items-center justify-center rounded-full bg-negative-wash">
        <ng-icon name="lucideTriangleAlert" size="28" class="text-negative" />
      </div>
      <h1 class="mt-2 text-xl font-semibold text-foreground">{{ 'common.error.title' | translate }}</h1>
      <p class="max-w-md text-sm text-muted-foreground">
        {{ 'common.error.description' | translate }}
      </p>
      <div class="mt-4">
        <a hlmBtn variant="outline" [routerLink]="routePaths.dashboard">{{
          'common.error.home' | translate
        }}</a>
      </div>
    </div>
  `,
})
export class ErrorPage {
  protected readonly routePaths = ROUTE_PATHS;
}
