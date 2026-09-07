import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, inject, provideBrowserGlobalErrorListeners } from '@angular/core';
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
  ],
};
