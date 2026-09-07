import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

const API_PREFIX = '/api';

export const apiPrefixInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(API_PREFIX)) {
    return next(req);
  }

  return next(req.clone({ url: `${environment.apiBaseUrl}${req.url}` }));
};
