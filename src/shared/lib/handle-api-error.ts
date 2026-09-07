import { HttpErrorResponse } from '@angular/common/http';

interface ValidationProblemDetails {
  readonly title?: string;
  readonly detail?: string;
  readonly errors?: Record<string, string[]>;
}

export interface ApiErrorMessages {
  readonly fallback: string;
  readonly connectivity: string;
}

export function getApiErrorMessage(error: unknown, messages: ApiErrorMessages): string {
  if (!(error instanceof HttpErrorResponse)) {
    return messages.fallback;
  }

  if (error.status === 0) {
    return messages.connectivity;
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

  return messages.fallback;
}
