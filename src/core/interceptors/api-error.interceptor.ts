import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Injector, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { toast } from '@spartan-ng/brain/sonner';
import { catchError, throwError } from 'rxjs';
import { getApiErrorMessage } from '../../shared/lib/handle-api-error';

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  // Captures the injector rather than injecting TranslateService eagerly: ngx-translate's own
  // loader fetches translations over this same HttpClient, so an unconditional inject() here
  // would ask for TranslateService while it's still under construction on the very first
  // language load - a circular dependency (NG0200). Resolving it lazily, only once a mutating
  // request actually fails, sidesteps that entirely.
  const injector = inject(Injector);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && MUTATING_METHODS.has(req.method)) {
        const translate = injector.get(TranslateService);
        toast.error(
          getApiErrorMessage(error, {
            fallback: translate.instant('common.toast.unexpectedError'),
            connectivity: translate.instant('common.toast.connectivityError'),
          }),
        );
      }
      return throwError(() => error);
    }),
  );
};
