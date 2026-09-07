import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';

@Component({
  selector: 'app-confirm-dialog',
  imports: [TranslatePipe, ...HlmAlertDialogImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <hlm-alert-dialog [state]="open() ? 'open' : 'closed'" (stateChanged)="onStateChanged($event)">
      <div hlmAlertDialogContent *hlmAlertDialogPortal>
        <div hlmAlertDialogHeader>
          <h2 hlmAlertDialogTitle>{{ title() }}</h2>
          <p hlmAlertDialogDescription>{{ message() }}</p>
        </div>
        <div hlmAlertDialogFooter>
          <button hlmAlertDialogCancel>{{ 'common.actions.cancel' | translate }}</button>
          <button hlmAlertDialogAction variant="destructive" (click)="confirmed.emit()">
            {{ 'common.actions.delete' | translate }}
          </button>
        </div>
      </div>
    </hlm-alert-dialog>
  `,
})
export class ConfirmDialog {
  readonly open = input(false);
  readonly title = input('');
  readonly message = input('');
  readonly confirmed = output<void>();
  readonly openChange = output<boolean>();

  protected onStateChanged(state: 'open' | 'closed'): void {
    this.openChange.emit(state === 'open');
  }
}
