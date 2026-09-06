import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { TranslateService, TranslationObject } from '@ngx-translate/core';
import { Observable, map, of, shareReplay, tap } from 'rxjs';
import { DEFAULT_LOCALE } from './config';

/**
 * Lazily fetches and merges a page-specific translation namespace (`dashboard`, `courses`, ...)
 * into ngx-translate's in-memory store, exactly once per (language, namespace) pair - repeat
 * visits to the same page in the same language are served from that cache, no re-fetch.
 *
 * On a language switch, the *currently active* namespace (the last one a route resolver asked
 * for) is re-fetched for the new language, since resolvers only run on navigation and wouldn't
 * otherwise notice the language changing while sitting on the same route.
 */
@Injectable({ providedIn: 'root' })
export class NamespaceI18nService {
  private readonly http = inject(HttpClient);
  private readonly translate = inject(TranslateService);

  private readonly loaded = new Set<string>();
  // Angular's router can invoke a resolver more than once for a single navigation (e.g. the
  // initial one on app bootstrap); without this, each concurrent call would race past the
  // `loaded` check before the first response lands and fire its own duplicate HTTP request.
  private readonly inFlight = new Map<string, Observable<void>>();
  private currentNamespace: string | undefined;

  constructor() {
    this.translate.onLangChange.subscribe(() => {
      if (this.currentNamespace) {
        this.ensureLoaded(this.currentNamespace).subscribe();
      }
    });
  }

  ensureLoaded(namespace: string): Observable<void> {
    this.currentNamespace = namespace;

    const lang = this.translate.currentLang() ?? DEFAULT_LOCALE;
    const cacheKey = `${lang}:${namespace}`;

    if (this.loaded.has(cacheKey)) {
      return of(void 0);
    }

    const pending = this.inFlight.get(cacheKey);
    if (pending) {
      return pending;
    }

    const request$ = this.http.get<TranslationObject>(`/i18n/${lang}/${namespace}.json`).pipe(
      tap((translations) => {
        this.translate.setTranslation(lang, translations, true);
        this.loaded.add(cacheKey);
        this.inFlight.delete(cacheKey);
      }),
      map(() => void 0),
      shareReplay({ bufferSize: 1, refCount: false }),
    );

    this.inFlight.set(cacheKey, request$);
    return request$;
  }
}
