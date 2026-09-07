import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { toast } from '@spartan-ng/brain/sonner';

export function createMutationNotifier(list: { reload(): void }): (toastKey: string) => void {
  const translate = inject(TranslateService);
  return (toastKey) => {
    list.reload();
    toast.success(translate.instant(toastKey));
  };
}
