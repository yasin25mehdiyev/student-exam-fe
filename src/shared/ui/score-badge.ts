import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { HlmBadge } from '@spartan-ng/helm/badge';

/** 0-3 = negative, 4-6 = warning, 7-9 = success - matches the backend's 0-9 exam score scale. */
@Component({
  selector: 'app-score-badge',
  imports: [HlmBadge],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span hlmBadge variant="outline" [class]="colorClass()">{{ score() }}</span>`,
})
export class ScoreBadge {
  readonly score = input.required<number>();

  protected readonly colorClass = computed(() => {
    const value = this.score();
    if (value >= 7) return 'border-transparent bg-success/10 text-success';
    if (value >= 4) return 'border-transparent bg-warning/10 text-warning';
    return 'border-transparent bg-negative/10 text-negative';
  });
}
