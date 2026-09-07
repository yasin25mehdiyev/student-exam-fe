# Student Exam Management System — Frontend

**[Live Demo →](https://student-exam-fe.onrender.com)**

Angular frontend for [`student-exam-be`](https://github.com/yasin25mehdiyev/student-exam-be),
a school exam-management API (courses, students, exams, reports). Built as a technical
assignment — **there is no authentication**; every route is open.

## Tech Stack

- **Angular 22 + TypeScript** — standalone components, zoneless change detection, signals end-to-end
- **`resource()` / `rxResource()`** — server-state loading, caching and reload, Angular's own primitive (no external query library)
- **Angular Router** — lazy-loaded routes, `withComponentInputBinding()` for typed route params
- **Reactive Forms** — validators mirrored from the backend's `DataAnnotations` constraints
- **Tailwind CSS 4** — CSS-variable design tokens (`src/styles.css`), same token shape as shadcn/ui
- **@spartan-ng** (Brain + Helm) — the Angular-ecosystem equivalent of shadcn/ui: headless Angular CDK primitives with Tailwind-styled components, copied into `src/shared/ui/primitives`
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
│   ├── layout/                # app shell — sidebar, header, breadcrumb, page title (singleton chrome, not a reusable slice)
│   ├── interceptors/            # HTTP interceptors (API origin prefix, error-toast on failed mutations)
│   └── pages/                    # global, feature-agnostic routes (404, unhandled-navigation error page)
├── shared/
│   ├── ui/
│   │   ├── primitives/            # spartan-ng components, copied in via `ng g @spartan-ng/cli:ui` — vendored, not hand-edited
│   │   └── custom/                 # hand-written, reusable presentational components (DataTable, ClassAveragesTable, confirm-dialog, score-badge, language-switcher, ...)
│   ├── i18n/                        # ngx-translate config + az/en/ru JSON, one namespace per feature
│   ├── lib/                          # generic helpers (API error parsing, sort-direction mapping, paged-list resource factory, route paths/breadcrumb, mutation-toast notifier)
│   └── api/generated/                 # Orval output — not hand-edited
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

- **Node.js** `^22.22.3 || ^24.15.0 || >=26.0.0` (Angular CLI 22's requirement — see `.node-version`/`package.json`'s `engines`)
- **pnpm** (this repo uses `pnpm-lock.yaml`)
- A reachable backend. `src/environments/environment.development.ts` points at the
  deployed API (`https://student-exam-api.azurewebsites.net`) by default, so `pnpm dev`
  works out of the box with no backend setup. To run against a local backend instead —
  see [`student-exam-be`](https://github.com/yasin25mehdiyev/student-exam-be) — change
  `apiBaseUrl` there to `http://localhost:5140` (its `Program.cs` already has a CORS
  policy open for `http://localhost:4200`).

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
pnpm generate:api   # fetches from API_URL (default http://localhost:5140) - override for a
                    # non-local backend, e.g. API_URL=https://student-exam-api.azurewebsites.net
```

Each feature's `data-access/*.service.ts` wraps the relevant generated service with
`rxResource` for reads (list + detail, exposed as signals) and plain methods for
mutations, which reload the list resource and show a toast on success via
`shared/lib/mutation-toast.ts`'s shared notifier. Failed mutations are caught once,
centrally, in `core/interceptors/api-error.interceptor.ts` — individual features don't
repeat try/catch-and-toast.

## Design Tokens

`src/styles.css` defines the same class of CSS-variable design-token system as
shadcn/ui-based apps: `--background`/`--foreground`/`--primary`/`--card`/`--border`/
etc., mapped into Tailwind's `color-*` namespace via `@theme inline` (spartan-ng's
Tailwind preset does the base mapping; this app adds its own brand scale
(`--brand-100/400/500/700`) and semantic status colors (`--success`/`--warning`/
`--negative`) on top, used for the 0–9 exam score badge). Only a light theme is
defined — there's no theme toggle or dark-mode variant.

Tailwind's PostCSS plugin is wired explicitly via `.postcssrc.json` (Angular's
build-time auto-detection only looks for a `tailwind.config.*` file, which Tailwind
4's CSS-first config doesn't use).

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
  spartan-ng component sources under `shared/ui/primitives/*/src`) is excluded — it
  isn't hand-authored here.
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
widths: `core/layout/sidebar-nav.ts` collapses to an icon rail on desktop and to a
full-width off-canvas drawer on narrow screens (hand-rolled, not spartan-ng's `sidebar`
primitive — that primitive was never adopted and has been removed), and layouts use
Tailwind's `sm:`/`md:` breakpoints throughout.

## Deployment

Deploys to [Render](https://render.com) as a static site. `render.yaml` in the repo
root defines the build (`pnpm build`) and publish directory
(`dist/student-exam-fe/browser`), plus a catch-all rewrite to `index.html` so the
Angular router's client-side routes work on a hard refresh or direct link. No
environment variables are needed at deploy time — `apiBaseUrl` is baked in at build
time via `src/environments/environment.ts`.

To deploy: in the Render dashboard, **New > Blueprint**, point it at this repo — it
picks up `render.yaml` automatically. Every push to `main` redeploys.
