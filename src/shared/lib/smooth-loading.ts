import { DestroyRef, Signal, effect, inject, signal } from '@angular/core';

const DEFAULT_MIN_DURATION_MS = 500;

/**
 * Keeps a loading flag `true` for at least `minDurationMs`, always - starting visible
 * unconditionally on creation rather than reading `source()`'s initial value. A signal-based
 * `isLoading` can flip true -> false within the same tick an `effect` first gets to run (e.g. a
 * resource that resolves before Angular schedules the effect), which would otherwise skip the
 * loading state entirely on fast/cached responses. Mirrors the client app's `useSmoothLoading`
 * hook, but unconditional rather than only smoothing observed transitions. Must be called from an
 * injection context (a component/service constructor or field initializer).
 */
export function smoothLoading(
  source: Signal<boolean>,
  minDurationMs = DEFAULT_MIN_DURATION_MS,
): Signal<boolean> {
  const visible = signal(true);
  // Seeded to "now", not null: even if the first effect run below already sees `source()` as
  // false (nothing observably loaded), this still holds `visible` for the full minDurationMs
  // from creation instead of collapsing the "remaining" computation to 0.
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
