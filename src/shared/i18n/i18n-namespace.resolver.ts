import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { NamespaceI18nService } from './namespace-i18n.service';

/** Blocks route activation until the given page-specific translation namespace is loaded (and
 *  merged into the store), so the page never renders with raw/missing translation keys. */
export function i18nNamespaceResolver(namespace: string): ResolveFn<void> {
  return () => inject(NamespaceI18nService).ensureLoaded(namespace);
}
