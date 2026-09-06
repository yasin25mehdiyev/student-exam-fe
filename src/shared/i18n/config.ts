import { HttpClient } from '@angular/common/http';
import { Injectable, Provider, inject } from '@angular/core';
import {
  TranslateLoader,
  TranslationObject,
  provideTranslateLoader,
  provideTranslateService,
} from '@ngx-translate/core';
import { Observable, forkJoin, map } from 'rxjs';

/**
 * One JSON file per (locale, namespace) pair, served from `public/i18n` at runtime (see the
 * `i18n` assets entry in angular.json) as `/i18n/{locale}/{namespace}.json`. Only `common` and
 * `nav` load eagerly here - the shell (sidebar/header/breadcrumb) needs both on every page. Every
 * other namespace (`dashboard`, `courses`, ...) is page-specific and loads lazily, on first visit
 * to the route that needs it - see `i18n-namespace.resolver.ts` / `NamespaceI18nService`.
 */
export const CORE_I18N_NAMESPACES = ['common', 'nav'] as const;

export const SUPPORTED_LOCALES = ['az', 'en', 'ru'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: SupportedLocale = 'az';

@Injectable()
class CoreTranslateLoader implements TranslateLoader {
  private readonly http = inject(HttpClient);

  getTranslation(lang: string): Observable<TranslationObject> {
    const requests = CORE_I18N_NAMESPACES.map((namespace) =>
      this.http.get<TranslationObject>(`/i18n/${lang}/${namespace}.json`),
    );
    return forkJoin(requests).pipe(
      map((namespaceResponses) => Object.assign({}, ...namespaceResponses) as TranslationObject),
    );
  }
}

export function provideAppTranslate(): Provider[] {
  return [
    provideTranslateService({
      lang: DEFAULT_LOCALE,
      fallbackLang: DEFAULT_LOCALE,
    }),
    provideTranslateLoader(CoreTranslateLoader),
  ];
}
