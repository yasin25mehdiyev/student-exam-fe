import { DestroyRef, Signal, effect, inject, signal } from '@angular/core';

const DEFAULT_MIN_DURATION_MS = 500;

export function smoothLoading(
  source: Signal<boolean>,
  minDurationMs = DEFAULT_MIN_DURATION_MS,
): Signal<boolean> {
  const visible = signal(true);
  let shownAt = Date.now();
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  inject(DestroyRef).onDestroy(() => clearTimeout(timeoutId));

  effect(() => {
    const isLoading = source();

    clearTimeout(timeoutId);
    if (isLoading) {
      shownAt = Date.now();
      visible.set(true);
      return;
    }

    const remaining = Math.max(0, minDurationMs - (Date.now() - shownAt));
    timeoutId = setTimeout(() => visible.set(false), remaining);
  });

  return visible.asReadonly();
}
