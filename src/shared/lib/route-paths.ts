/** Single source of truth for absolute route paths, mirroring app.routes.ts's structure. */
export const ROUTE_PATHS = {
  dashboard: '/',
  courses: '/courses',
  students: '/students',
  exams: '/exams',
  reports: '/reports',
  notFound: '/not-found',
} as const;
