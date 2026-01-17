# Fullstack B2B

A complete B2B SaaS monorepo with Django API backend and React frontend.

## Stack

- **Backend**: Django 5.2 + django-matt + PostgreSQL
- **Frontend**: React 18 + Vite + TailwindCSS + TanStack Query
- **Infrastructure**: Docker + Docker Compose

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

## Deployment

```bash
# Build production images
make build

# Start production
make prod
```

## License

MIT
