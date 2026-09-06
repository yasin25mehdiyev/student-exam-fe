import { HttpErrorResponse } from '@angular/common/http';
import { getApiErrorMessage } from './handle-api-error';

describe('getApiErrorMessage', () => {
  it('returns the raw string body for business-rule failures', () => {
    const error = new HttpErrorResponse({ status: 409, error: "Course with code 'MTH' already exists." });
    expect(getApiErrorMessage(error)).toBe("Course with code 'MTH' already exists.");
  });

  it('flattens ValidationProblemDetails field errors', () => {
    const error = new HttpErrorResponse({
      status: 400,
      error: { title: 'Bad Request', errors: { Code: ['Code must be 3 characters.'] } },
    });
    expect(getApiErrorMessage(error)).toBe('Code must be 3 characters.');
  });

  it('falls back to a connectivity message when status is 0', () => {
    const error = new HttpErrorResponse({ status: 0 });
    expect(getApiErrorMessage(error)).toContain('Serverə qoşulmaq');
  });

  it('returns the fallback for a non-HttpErrorResponse value', () => {
    expect(getApiErrorMessage(new Error('boom'), 'fallback')).toBe('fallback');
  });
});
