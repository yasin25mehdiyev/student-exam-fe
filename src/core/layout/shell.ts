import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { HlmToaster } from '@spartan-ng/helm/sonner';
import { Breadcrumb } from './breadcrumb';
import { Header } from './header';
import { SidebarNav } from './sidebar-nav';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, HlmToaster, Header, SidebarNav, Breadcrumb],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex h-svh w-full gap-4 overflow-hidden bg-wash p-3 md:p-5">
      <app-sidebar-nav
        [mobileOpen]="mobileNavOpen()"
        (mobileOpenChange)="mobileNavOpen.set($event)"
      />

      <div class="flex min-h-0 min-w-0 flex-1 flex-col gap-4">
        <app-header (openMobileNav)="mobileNavOpen.set(true)" />
        <main class="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
          <app-breadcrumb />
          <router-outlet />
        </main>
      </div>
    </div>

    <hlm-toaster richColors />
  `,
})
export class Shell {
  protected readonly mobileNavOpen = signal(false);

  constructor() {
    const router = inject(Router);
    const subscription = router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.mobileNavOpen.set(false));
    inject(DestroyRef).onDestroy(() => subscription.unsubscribe());
  }
}
