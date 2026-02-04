# Fullstack B2B

[![CI](https://github.com/yourusername/fullstack-b2b/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/fullstack-b2b/actions/workflows/ci.yml)

A complete B2B SaaS monorepo with Django API backend and React frontend.

## Stack

- **Backend**: Django 5.2 + Django Ninja + PostgreSQL + uv
- **Frontend**: React 19 + Vite + TailwindCSS + TanStack Query + bun
- **Infrastructure**: Docker + Docker Compose + GitHub Actions

## Quick Start

```bash
# Clone
git clone https://github.com/yourusername/fullstack-b2b.git myproject
cd myproject

# Copy env file
cp .env.example .env

# Start development
make dev
```

Visit:
- Frontend: http://localhost:5173
- API: http://localhost:8000
- API Docs: http://localhost:8000/api/docs

## Project Structure

```
fullstack-b2b/
├── backend/                 # Django API (django-api-b2b)
│   ├── apps/
│   │   ├── users/
│   │   └── organizations/
│   ├── config/
│   └── Dockerfile
├── frontend/                # React app (react-vite-b2b)
│   ├── src/
│   │   ├── components/
│   │   ├── lib/
│   │   └── pages/
│   └── Dockerfile
├── docker-compose.yml
├── Makefile
└── README.md
```

## Commands

```bash
make dev           # Start dev environment
make prod          # Start production
make build         # Build containers
make down          # Stop containers
make migrate       # Run migrations
make sync-types    # Generate TypeScript types from backend
make lint          # Run linting on both frontend and backend
make format        # Format code
make test          # Run all tests
make clean         # Remove containers and volumes
```

## Development Workflow

1. Start services: `make dev`
2. Backend changes auto-reload
3. Frontend hot-reloads
4. Run `make sync-types` after schema changes

## Features

- Multi-tenant organizations
- Team management
- Role-based access control
- JWT authentication
- Organization switcher UI
- Type-safe API client

## CI/CD

This project includes a GitHub Actions CI workflow that:

- **Backend**: Runs linting (ruff), type checking (mypy), and tests (pytest) with PostgreSQL
- **Frontend**: Runs linting (eslint), type checking (tsc), and builds
- **Docker**: Builds both backend and frontend images

The workflow runs on every push and pull request to the `main` branch.

## Deployment

```bash
# Build production images
make build

# Start production
make prod
```

## License

MIT
