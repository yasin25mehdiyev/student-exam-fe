import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { toast } from '@spartan-ng/brain/sonner';

/** Reloads `list` and shows a translated success toast - the standard after-mutation side
 *  effect every feature's create/update/delete triggers. Must be called from an injection
 *  context (a service constructor or field initializer), same as `createPagedList`. */
export function createMutationNotifier(list: { reload(): void }): (toastKey: string) => void {
  const translate = inject(TranslateService);
  return (toastKey) => {
    list.reload();
    toast.success(translate.instant(toastKey));
  };
}
