import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import {
  RedirectCommand,
  Router,
  provideRouter,
  withComponentInputBinding,
  withNavigationErrorHandler,
} from '@angular/router';
import { routes } from './app.routes';
import { apiErrorInterceptor } from '../core/interceptors/api-error.interceptor';
import { apiPrefixInterceptor } from '../core/interceptors/api-prefix.interceptor';
import { provideAppTranslate } from '../shared/i18n/config';
import { LocaleService } from '../shared/i18n/locale.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withNavigationErrorHandler((error) => {
        console.error(error);
        return new RedirectCommand(inject(Router).parseUrl('/error'));
      }),
    ),
    provideHttpClient(withInterceptors([apiPrefixInterceptor, apiErrorInterceptor])),
    provideAppTranslate(),
    // Applies the persisted/default locale before the router's initial navigation - including
    // to the standalone not-found page, which sits outside Shell and would otherwise never
    // trigger LocaleService's constructor.
    provideAppInitializer(() => {
      inject(LocaleService);
    }),
  ],
};
