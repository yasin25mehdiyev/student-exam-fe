import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';

// Shows on every navigation, not just slow ones - even an instant, already-cached route change
// gets a brief flash so the bar reads as reliable feedback rather than something that only
// sometimes appears. `MIN_VISIBLE_MS` is the floor: the bar always stays up at least this long
// once a navigation starts, however fast the route/chunk actually resolves.
const MIN_VISIBLE_MS = 400;

/** Top-of-viewport loading bar shown while a route (and its lazy-loaded chunk) is navigating -
 *  the Angular Router equivalent of a route-level Suspense fallback. */
@Component({
  selector: 'app-route-progress-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <div class="fixed top-0 left-0 z-50 h-1 w-full overflow-hidden bg-transparent">
        <div class="h-full w-2/5 animate-route-progress bg-brand-500"></div>
      </div>
    }
  `,
})
export class RouteProgressBar {
  private readonly router = inject(Router);

  protected readonly visible = signal(false);

  private hideTimeoutId?: ReturnType<typeof setTimeout>;
  private shownAt: number | null = null;

  constructor() {
    const subscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.onNavigationStart();
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.onNavigationSettled();
      }
    });

    inject(DestroyRef).onDestroy(() => {
      subscription.unsubscribe();
      clearTimeout(this.hideTimeoutId);
    });
  }

  private onNavigationStart(): void {
    clearTimeout(this.hideTimeoutId);
    this.shownAt = Date.now();
    this.visible.set(true);
  }

  private onNavigationSettled(): void {
    if (!this.visible()) {
      return;
    }

    const elapsed = this.shownAt === null ? MIN_VISIBLE_MS : Date.now() - this.shownAt;
    const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);
    this.hideTimeoutId = setTimeout(() => this.visible.set(false), remaining);
  }
}
