import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';

const MIN_VISIBLE_MS = 400;
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
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
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

    inject(DestroyRef).onDestroy(() => clearTimeout(this.hideTimeoutId));
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
