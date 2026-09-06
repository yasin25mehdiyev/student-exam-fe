import { HttpErrorResponse } from '@angular/common/http';

/**
 * The backend returns errors in two different shapes depending on where they
 * originate (see StudentExam.Api.Controllers.ApiControllerBase.MapError):
 * - business-rule failures (not found, conflict, validation inside a service) are a
 *   raw JSON string, e.g. `"Course not found"`.
 * - automatic model-binding validation failures (DataAnnotations on Create/Update
 *   DTOs) are ASP.NET Core's default ValidationProblemDetails, e.g.
 *   `{ errors: { Code: ["..."] }, title, status }`.
 */
interface ValidationProblemDetails {
  readonly title?: string;
  readonly detail?: string;
  readonly errors?: Record<string, string[]>;
}

export function getApiErrorMessage(
  error: unknown,
  fallback = 'Gözlənilməz xəta baş verdi.',
): string {
  if (!(error instanceof HttpErrorResponse)) {
    return fallback;
  }

  if (error.status === 0) {
    return 'Serverə qoşulmaq mümkün olmadı. İnternet bağlantınızı yoxlayın.';
  }

  const body: unknown = error.error;

  if (typeof body === 'string' && body.trim().length > 0) {
    return body;
  }

  const problem = body as ValidationProblemDetails | null;
  if (problem?.errors) {
    const messages = Object.values(problem.errors).flat();
    if (messages.length > 0) {
      return messages.join(' ');
    }
  }

  if (problem?.detail) {
    return problem.detail;
  }

  if (problem?.title) {
    return problem.title;
  }

  return fallback;
}
