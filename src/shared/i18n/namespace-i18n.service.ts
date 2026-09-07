import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { TranslateService, TranslationObject } from '@ngx-translate/core';
import { Observable, map, of, shareReplay, tap } from 'rxjs';
import { DEFAULT_LOCALE } from './config';

@Injectable({ providedIn: 'root' })
export class NamespaceI18nService {
  private readonly http = inject(HttpClient);
  private readonly translate = inject(TranslateService);

  private readonly loaded = new Set<string>();
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
