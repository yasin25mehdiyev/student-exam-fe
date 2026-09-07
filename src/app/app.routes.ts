import { Routes } from '@angular/router';
import { Shell } from '../core/layout/shell';
import { i18nNamespaceResolver } from '../shared/i18n/i18n-namespace.resolver';

export const routes: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../features/dashboard/feature/dashboard.page').then((m) => m.DashboardPage),
        data: { breadcrumb: 'nav.dashboard' },
        resolve: { i18n: i18nNamespaceResolver('dashboard') },
      },
      {
        path: 'courses',
        data: { breadcrumb: 'nav.courses' },
        resolve: { i18n: i18nNamespaceResolver('courses') },
        children: [
          {
            path: '',
            loadComponent: () =>
              import('../features/courses/feature/course-list.page').then(
                (m) => m.CourseListPage,
              ),
          },
          {
            path: 'new',
            loadComponent: () =>
              import('../features/courses/feature/course-create.page').then(
                (m) => m.CourseCreatePage,
              ),
            data: { breadcrumb: 'courses.createTitle' },
          },
          {
            path: ':code/edit',
            loadComponent: () =>
              import('../features/courses/feature/course-edit.page').then(
                (m) => m.CourseEditPage,
              ),
            data: { breadcrumb: 'courses.editTitle' },
          },
        ],
      },
      {
        path: 'students',
        data: { breadcrumb: 'nav.students' },
        resolve: { i18n: i18nNamespaceResolver('students') },
        children: [
          {
            path: '',
            loadComponent: () =>
              import('../features/students/feature/student-list.page').then(
                (m) => m.StudentListPage,
              ),
          },
          {
            path: 'new',
            loadComponent: () =>
              import('../features/students/feature/student-create.page').then(
                (m) => m.StudentCreatePage,
              ),
            data: { breadcrumb: 'students.createTitle' },
          },
          {
            path: ':number/edit',
            loadComponent: () =>
              import('../features/students/feature/student-edit.page').then(
                (m) => m.StudentEditPage,
              ),
            data: { breadcrumb: 'students.editTitle' },
          },
        ],
      },
      {
        path: 'exams',
        data: { breadcrumb: 'nav.exams' },
        resolve: { i18n: i18nNamespaceResolver('exams') },
        children: [
          {
            path: '',
            loadComponent: () =>
              import('../features/exams/feature/exam-list.page').then((m) => m.ExamListPage),
          },
          {
            path: 'new',
            loadComponent: () =>
              import('../features/exams/feature/exam-create.page').then((m) => m.ExamCreatePage),
            data: { breadcrumb: 'exams.createTitle' },
          },
          {
            path: ':id/edit',
            loadComponent: () =>
              import('../features/exams/feature/exam-edit.page').then((m) => m.ExamEditPage),
            data: { breadcrumb: 'exams.editTitle' },
          },
        ],
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('../features/reports/feature/reports.page').then((m) => m.ReportsPage),
        data: { breadcrumb: 'nav.reports' },
        resolve: { i18n: i18nNamespaceResolver('reports') },
      },
      {
        path: 'error',
        loadComponent: () => import('../core/pages/error.page').then((m) => m.ErrorPage),
        data: { breadcrumb: 'common.error.title' },
      },
    ],
  },
  {
    path: 'not-found',
    loadComponent: () => import('../core/pages/not-found.page').then((m) => m.NotFoundPage),
    data: { breadcrumb: 'common.notFound.title' },
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
];
