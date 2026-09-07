import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, SupportedLocale } from './config';

const STORAGE_KEY = 'student-exam-fe.locale';

@Injectable({ providedIn: 'root' })
export class LocaleService {
  private readonly translate = inject(TranslateService);

  readonly current = signal<SupportedLocale>(this.readStored() ?? DEFAULT_LOCALE);

  /** Resolves once the initial locale's core translations have loaded - the app initializer
   *  awaits this so routing (and any `i18nNamespaceResolver`) doesn't start until
   *  `translate.instant()` calls actually have something to return. */
  readonly ready: Observable<unknown> = this.translate.use(this.current());

  setLocale(locale: SupportedLocale): void {
    this.current.set(locale);
    this.translate.use(locale);
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // localStorage unavailable (private mode, disabled storage) - locale just won't persist
    }
  }

  private readStored(): SupportedLocale | null {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      return (SUPPORTED_LOCALES as readonly string[]).includes(value ?? '')
        ? (value as SupportedLocale)
        : null;
    } catch {
      return null;
    }
  }
}
