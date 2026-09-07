import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { toast } from '@spartan-ng/brain/sonner';
import { catchError, throwError } from 'rxjs';
import { getApiErrorMessage } from '../../shared/lib/handle-api-error';

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && MUTATING_METHODS.has(req.method)) {
        toast.error(getApiErrorMessage(error));
      }
      return throwError(() => error);
    }),
  );
