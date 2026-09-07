import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { NamespaceI18nService } from './namespace-i18n.service';

export function i18nNamespaceResolver(namespace: string): ResolveFn<void> {
  return () => inject(NamespaceI18nService).ensureLoaded(namespace);
}
