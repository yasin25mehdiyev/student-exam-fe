import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { HlmButton } from '@spartan-ng/helm/button';

/**
 * Rendered as a standalone top-level route (outside the Shell) so an unmatched URL shows a bare
 * full-screen page with no sidebar/header - matching the client app's actual behavior, where an
 * unmatched path resolves at the router root rather than inside the dashboard layout.
 */
@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink, TranslatePipe, HlmButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="flex min-h-svh w-full flex-col items-center justify-center gap-3 bg-wash px-4 text-center"
    >
      <p class="text-5xl font-bold text-brand-500">404</p>
      <h1 class="text-xl font-semibold text-foreground">{{ 'common.notFound.title' | translate }}</h1>
      <p class="max-w-md text-sm text-muted-foreground">
        {{ 'common.notFound.description' | translate }}
      </p>
      <div class="mt-4 flex items-center gap-3">
        <a hlmBtn routerLink="/">{{ 'common.notFound.home' | translate }}</a>
        <a hlmBtn variant="outline" routerLink="/students">{{
          'common.notFound.browse' | translate
        }}</a>
      </div>
    </div>
  `,
})
export class NotFoundPage {}
