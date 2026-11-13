# Agent instructions

Single source of agent instructions for this repo. Reference material lives in
the package READMEs; this file holds the rules.

## Project overview

B2B SaaS monorepo:

- `backend/` — Django 5.2 + Django Ninja + PostgreSQL, dependencies managed
  with uv. Apps live in `backend/apps/<app>/` (`models.py`, `schemas.py`,
  `controllers.py`, `admin.py`).
- `frontend/` — React 19 + Vite + TailwindCSS + TanStack Query, managed with
  bun.
- `docker-compose.yml` — PostgreSQL, Redis, API and frontend services.
- `scripts/db/` — migration graph, leaf, lint and renumbering checks.

The frontend API client is generated from the committed OpenAPI schema at
`backend/docs/openapi/openapi.json`; never edit `frontend/src/api/generated/`
by hand. Details: [backend README](backend/README.md),
[frontend README](frontend/README.md).

## Commands

Run from the repo root. `make lint` and `make test` call `ruff` and `pytest`
from `PATH`, so activate the venv first:
`source backend/.venv/bin/activate`.

| Command | What it does | Needs |
| --- | --- | --- |
| `cd backend && uv venv && uv sync --group dev` | Create the backend venv and install dev deps | uv |
| `cd frontend && bun install` | Install frontend deps | bun |
| `make install` | Both installs above | backend venv |
| `make dev` | Postgres + Redis, migrate, API on :8000 and frontend on :5173 (foreground) | Docker |
| `make prod` | Full production compose stack (detached) | Docker |
| `make build` | Build the API and frontend images | Docker |
| `make down` | Stop the compose services | Docker |
| `make migrate` | Apply Django migrations | Postgres (or `USE_SQLITE=True`) |
| `make makemigrations` | Generate migrations after a model change | backend venv |
| `make migrations-check` | Migration leaf, lint and no-merge checks | backend venv |
| `make migrations-renumber` | Dry-run a conflict fix; `ARGS=--apply` writes | backend venv |
| `make lint` | `ruff check`, `ruff format --check`, then oxlint | backend venv + `bun install` |
| `make format` | `ruff format`, then oxfmt | backend venv + `bun install` |
| `make test` | Backend pytest, then frontend typecheck | backend venv + Postgres |
| `make agents-check` | AGENTS.md links, CLAUDE.md and skill frontmatter | python3 |

Frontend scripts (`cd frontend`): `bun run dev`, `build`, `lint`, `lint:strict`,
`lint:fix`, `typecheck`, `format`, `format:check`, `doctor`, `check-conventions`,
`check-dependencies`, `api:generate`, `api:check` and `gauntlet`. `gauntlet` is
the full static gate. `dev`, `build` and `typecheck` regenerate
`src/api/generated` first.

## Code standards

- Backend: ruff (line length 100) and mypy. Pydantic schemas go in
  `schemas.py`, handlers in `controllers.py`, routers are mounted from
  `backend/apps/api.py`.
- Frontend: TypeScript strict, oxlint + oxfmt. `bun run check-conventions`
  bans `as any`, `@ts-ignore`, `console.log`, default-exported components and
  raw axios/fetch outside `src/lib/api.ts`.
- Dependencies: the inventory and its rules live in
  [frontend/DEPENDENCIES.md](frontend/DEPENDENCIES.md), enforced by
  `bun run check-dependencies`.
- API changes: regenerate the schema with
  `cd backend && python manage.py export_openapi`, then regenerate the client
  with `cd frontend && bun run api:generate`. `bun run api:check` fails on a
  stale client.

## Testing

- Backend: `pytest` from `backend/` (`make test-backend`). Tests live in
  `backend/tests/` and need PostgreSQL, or set `USE_SQLITE=True`.
- Frontend: `cd frontend && bun run gauntlet` (lint, typecheck, convention and
  dependency gates, generated-client check).
- CI (`.github/workflows/ci.yml`) runs the backend tests, frontend
  lint/typecheck/build, the migration checks and `make agents-check`.

## Git and commits

- Conventional Commits: `type(scope): Imperative summary`. Subject at most 50
  characters; body wrapped at 72.
- Never commit generated files: `frontend/src/api/generated/` is gitignored.
- Reference material stays in the READMEs; keep rules in this file only.

## Migrations

- Migrations are linearized, never merged. **Never run
  `makemigrations --merge`** and never add a merge migration.
- Never edit a migration that is already on `main`. Add a new migration
  instead.
- After you add or change a model or a migration, and before you push, run
  `make migrations-check`.
- On a migration conflict (two leaf nodes, or the same number as `main`), run
  `make migrations-renumber` (dry run), then
  `make migrations-renumber ARGS=--apply`. It renames only your own files
  after the latest migration on `main`.
- When it prints `escalate to owner` (`RunPython`, `RunSQL`, `RemoveField`,
  `RenameField`, `DeleteModel`, `replaces`, or a clashing `AlterField`), stop
  and report it.
- Rule exceptions for django-safe-migrations go in
  `backend/config/migration_lint.py`. Existing findings sit in
  `scripts/baselines/migration-safety.json`. Inline
  `# safe-migrations: ignore` comments are banned.

## Spec workflow (agent-run)

Specs live in `tasks/specs/` ([README](tasks/specs/README.md)). A spec names
the files it owns; change only those files. The agent-run gate runs this repo's
checks before it opens the PR, so keep lint, typecheck, build and the migration
and agent-doc checks green.

## Security

- Never commit secrets. `.env` files are gitignored; `.env.example` is the only
  committed environment file, and `SECRET_KEY`, database credentials and
  `ALLOWED_HOSTS` come from the environment.
- Run production with `DEBUG=False` and an explicit `ALLOWED_HOSTS`.
