import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { toast } from '@spartan-ng/brain/sonner';
import { catchError, throwError } from 'rxjs';
import { getApiErrorMessage } from '../../shared/lib/handle-api-error';

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const translate = inject(TranslateService);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && MUTATING_METHODS.has(req.method)) {
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
