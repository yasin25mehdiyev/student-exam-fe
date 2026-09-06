import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

/**
 * Generated Orval services call relative paths (e.g. `/api/courses`) since the
 * OpenAPI spec has no server URL baked in. Prefix those with the configured API
 * origin so the app can point at a different backend per environment.
 */
export const apiPrefixInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith('/api')) {
    return next(req);
  }

  return next(req.clone({ url: `${environment.apiBaseUrl}${req.url}` }));
};
