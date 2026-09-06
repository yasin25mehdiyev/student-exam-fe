# Tədris İmtahan Sistemi — Frontend

Angular frontend for [`student-exam-be`](../student-exam-be), a school exam-management
API (courses, students, exams, reports). Built as a technical assignment — **there is
no authentication**; every route is open.

## Tech Stack

- **Angular 22 + TypeScript** — standalone components, zoneless change detection, signals end-to-end
- **`resource()` / `rxResource()`** — server-state loading, caching and reload, Angular's own primitive (no external query library)
- **Angular Router** — lazy-loaded routes, `withComponentInputBinding()` for typed route params
- **Reactive Forms** — validators mirrored from the backend's `DataAnnotations` constraints
- **Tailwind CSS 4** — CSS-variable design tokens (`src/styles.css`), same token shape as shadcn/ui
- **@spartan-ng** (Brain + Helm) — the Angular-ecosystem equivalent of shadcn/ui: headless Angular CDK primitives with Tailwind-styled components, copied into `src/shared/ui`
- **@ngx-translate** — runtime i18n, az/en/ru, `localStorage`-remembered locale
- **Orval + Axios-free `HttpClient`** — typed API client generated from the backend's OpenAPI spec
- **ESLint (angular-eslint), Prettier, Husky, lint-staged, commitlint, commitizen (cz-git)** — code quality and commit hygiene

## Architecture

This is **not** Feature-Sliced Design. FSD's `entities`/`features` slices exist to make
up for React having no built-in DI or service layer — Angular already has that, so
copying FSD's folder names here would fight the framework instead of using it.

Instead, the codebase follows the layering from Angular's own style guide
(`core` / `shared` / `feature`), with each feature internally split the way Nx
categorizes libraries (`data-access` / `feature` / `ui`) — the pattern most
professional/enterprise Angular codebases converge on, whether or not they use Nx as
a build tool:

```
src/
├── app/                    # bootstrap: app.config.ts (providers, zoneless, HttpClient + interceptors), app.routes.ts
├── core/
│   └── layout/               # app shell — sidebar, header, breadcrumb, language switcher (singleton chrome, not a reusable slice)
│   └── http/                  # HTTP interceptors (API origin prefix, error-toast on failed mutations)
├── shared/
│   ├── ui/                   # design system — spartan-ng components (copied in via `ng g @spartan-ng/cli:ui`) + custom (confirm-dialog, score-badge)
│   ├── i18n/                  # ngx-translate config + az/en/ru JSON, one namespace per feature
│   ├── lib/                    # generic helpers (API error parsing, sort-direction mapping, paged-list resource factory)
│   └── api/generated/           # Orval output — not hand-edited
└── features/
    ├── dashboard/
    ├── courses/
    │   ├── data-access/         # course.service.ts (wraps the generated API client with rxResource), course.model.ts
    │   ├── feature/               # routed pages: course-list, course-create, course-edit
    │   └── ui/                     # presentational: course-table, course-form
    ├── students/                  # same shape as courses
    ├── exams/                      # same shape (course/student pickers via lookups)
    └── reports/                     # student report + class-averages views
```

Dependency rule: `shared` never imports `core` or `features`; `core` never imports
`features`; within a feature, `feature/` composes `ui/` + `data-access/`, and `ui/`
never injects a `data-access` service directly — it only receives data through
`input()`/`output()`.

## Prerequisites

- **Node.js 20+**
- **pnpm** (this repo uses `pnpm-lock.yaml`)
- The backend running locally — see [`../student-exam-be/README.md`](../student-exam-be/README.md). It must be reachable at the URL configured in `src/environments/environment.development.ts` (default `http://localhost:5140`), and its Program.cs already has a CORS policy open for `http://localhost:4200`.

## Getting Started

```bash
pnpm install
pnpm dev
```

The app opens at `http://localhost:4200`. No `.env` file is needed — the API origin
is configured in `src/environments/environment.development.ts` (Angular's standard
per-configuration environment file, swapped in automatically for `ng serve`/dev
builds via `angular.json`'s `fileReplacements`).

## Commands

| Command | Description |
| --- | --- |
| `pnpm dev` | Starts the dev server |
| `pnpm build` | Type-checks and produces a production build |
| `pnpm test` | Runs unit tests (Vitest) |
| `pnpm lint` | Lints the whole project |
| `pnpm lint:fix` | Auto-fixes lint errors |
| `pnpm format` | Formats the project with Prettier |
| `pnpm generate:api` | Fetches the backend's live OpenAPI spec and regenerates the typed client (Orval) |
| `pnpm commit` | Interactive Conventional Commits prompt (Commitizen) |

## API Client

`src/shared/api/generated` is not hand-written — it's produced by
[Orval](https://orval.dev) from the backend's OpenAPI schema
(`src/shared/api/swagger.json`), using Orval's `angular` client mode: one injectable
`HttpClient`-based service per controller tag (`CourseService`, `StudentService`,
`ExamService`, `ReportService`), plus typed request/response models. Regenerate it
whenever the backend's contract changes:

```bash
pnpm generate:api   # backend must be running at API_URL (default http://localhost:5140)
```

Each feature's `data-access/*.service.ts` wraps the relevant generated service with
`rxResource` for reads (list + detail, exposed as signals) and plain methods for
mutations, which reload the list resource and show a toast on success. Failed
mutations are caught once, centrally, in `core/http/api-error.interceptor.ts` —
individual features don't repeat try/catch-and-toast.

## Design Tokens

`src/styles.css` defines the same class of CSS-variable design-token system as
shadcn/ui-based apps: `--background`/`--foreground`/`--primary`/`--card`/`--border`/
etc., mapped into Tailwind's `color-*` namespace via `@theme inline` (spartan-ng's
Tailwind preset does the base mapping; this app adds its own brand scale
(`--brand-100/400/500/700`) and semantic status colors (`--success`/`--warning`/
`--negative`) on top, used for the 0–9 exam score badge). Both light and dark
variants are defined; the app doesn't currently expose a theme toggle, but the tokens
are ready for one.

## Multi-language Support

Translation files live in `src/shared/i18n/locales/<namespace>/<locale>.json` — one
namespace per feature (`common`, `nav`, `dashboard`, `courses`, `students`, `exams`,
`reports`), az/en/ru each. They're served as static assets (see the `i18n` entry in
`angular.json`'s `assets`) and loaded at runtime by `@ngx-translate/http-loader`,
which fetches and deep-merges every namespace per language. Azerbaijani (`az`) is the
default and fallback locale; the selected locale is remembered in `localStorage` via
`shared/i18n/locale.service.ts`.

Business-rule error messages (e.g. "Course with code 'MTH' already exists.") come
from the backend as-is and are only in English — the backend itself has no i18n. Only
the frontend's own UI chrome, labels and client-side validation messages are fully
localized.

## Code Quality and Git Hooks

- **ESLint** (`angular-eslint` + `typescript-eslint`, flat config) — lints both `.ts`
  files and Angular templates (inline templates included via
  `angular.processInlineTemplates`). Vendored code (`shared/api/generated`, the
  spartan-ng component sources under `shared/ui/*/src`) is excluded — it isn't
  hand-authored here.
- **Husky pre-commit** — runs `lint-staged`, which lints/fixes and formats only the
  files being committed.
- **Husky commit-msg** — validates the commit message against Conventional Commits
  via `commitlint`.

### Commit message format

```
<type>(<optional scope>): <summary>

<optional body>
```

Common types: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `style`, `perf`,
`ci`, `build`, `revert`.

```bash
git commit -m "feat(courses): add class-level filter to the course table"
```

Or use the interactive prompt instead of writing the message by hand:

```bash
pnpm commit
```

## Responsive Design

The app shell (sidebar, header, tables, forms) adapts to mobile/tablet/desktop
widths: the sidebar collapses to an icon rail on desktop and to an off-canvas sheet
on narrow screens (spartan-ng's sidebar primitive), and layouts use Tailwind's `sm:`/
`md:` breakpoints throughout.
