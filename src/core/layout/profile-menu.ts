import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HlmAvatar, HlmAvatarFallback, HlmAvatarImage } from '@spartan-ng/helm/avatar';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucideUser } from '@ng-icons/lucide';
import { HlmDropdownMenu, HlmDropdownMenuTrigger } from '@spartan-ng/helm/dropdown-menu';

// Static placeholder profile - the app has no auth/current-user concept yet, so this
// stands in for the signed-in user shown in the header (mirrors the client app's header,
// minus the logout action which has nothing to log out of here). Exported so the mobile
// sidebar drawer's profile row (matching client's mobile sidebar header) can reuse it.
export const PROFILE = {
  name: 'Yasin Mehdiyev',
  email: 'yasin.mehdiyev@numune.az',
  avatarUrl: 'https://i.pravatar.cc/300?img=12',
};

@Component({
  selector: 'app-profile-menu',
  imports: [NgIcon, HlmAvatar, HlmAvatarImage, HlmAvatarFallback, HlmDropdownMenu, HlmDropdownMenuTrigger],
  providers: [provideIcons({ lucideChevronDown, lucideUser })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full py-1 pr-3 pl-1 hover:bg-wash"
      [hlmDropdownMenuTrigger]="menu"
      align="end"
      (hlmDropdownMenuOpened)="open.set(true)"
      (hlmDropdownMenuClosed)="open.set(false)"
    >
      <hlm-avatar>
        <img hlmAvatarImage [src]="profile.avatarUrl" [alt]="profile.name" />
        <span hlmAvatarFallback><ng-icon name="lucideUser" size="16" /></span>
      </hlm-avatar>
      <ng-icon
        name="lucideChevronDown"
        size="16"
        class="text-muted-foreground transition-transform"
        [class.rotate-180]="open()"
      />
    </button>

    <ng-template #menu>
      <div hlmDropdownMenu class="w-72 min-w-0">
        <div class="flex items-center gap-2.5 px-2 py-2">
          <hlm-avatar size="lg" class="shrink-0">
            <img hlmAvatarImage [src]="profile.avatarUrl" [alt]="profile.name" />
            <span hlmAvatarFallback><ng-icon name="lucideUser" size="18" /></span>
          </hlm-avatar>
          <div class="flex min-w-0 flex-col">
            <span class="truncate text-sm font-medium text-foreground">{{ profile.name }}</span>
            <span class="text-xs whitespace-nowrap text-muted-foreground">{{ profile.email }}</span>
          </div>
        </div>
      </div>
    </ng-template>
  `,
})
export class ProfileMenu {
  protected readonly profile = PROFILE;
  protected readonly open = signal(false);
}
