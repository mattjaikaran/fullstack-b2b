.PHONY: help dev prod build down logs clean install migrate lint format test migrations-check migrations-renumber

help:
	@echo "Fullstack B2B - Development Commands"
	@echo ""
	@echo "  make install    - Install all dependencies"
	@echo "  make dev        - Start development environment"
	@echo "  make prod       - Start production environment"
	@echo "  make build      - Build all containers"
	@echo "  make down       - Stop all containers"
	@echo "  make logs       - View container logs"
	@echo "  make migrate    - Run database migrations"
	@echo "  make migrations-check - Leaf, lint and no-merge checks"
	@echo "  make migrations-renumber - Fix a migration conflict (ARGS=--apply)"
	@echo "  make lint       - Run linting on both frontend and backend"
	@echo "  make format     - Format code"
	@echo "  make test       - Run all tests"
	@echo "  make clean      - Remove all containers and volumes"

# Install dependencies
install:
	cd backend && uv pip install -e ".[dev]"
	cd frontend && bun install

# Development
dev:
	docker compose up -d db redis
	@echo "Waiting for database..."
	@sleep 3
	make migrate
	@echo ""
	@echo "Starting development servers..."
	@echo "  API:      http://localhost:8000"
	@echo "  Frontend: http://localhost:5173"
	@echo ""
	docker compose --profile dev up

dev-api:
	cd backend && python manage.py runserver

dev-frontend:
	cd frontend && bun run dev

# Production
prod:
	docker compose up -d

build:
	docker compose build

down:
	docker compose down

logs:
	docker compose logs -f

# Database
migrate:
	cd backend && python manage.py migrate

makemigrations:
	cd backend && python manage.py makemigrations

# Migrations are linearized, never merged: never `makemigrations --merge`.
migrations-check:
	python3 scripts/db/check_migrations.py

# Dry run; `make migrations-renumber ARGS=--apply` writes the renames.
migrations-renumber:
	python3 scripts/db/renumber_migrations.py $(ARGS)

superuser:
	cd backend && python manage.py createsuperuser

# Utilities
shell:
	cd backend && python manage.py shell

dbshell:
	docker compose exec db psql -U postgres -d myproject

# Type sync
sync-types:
	cd backend && python manage.py sync_types --target typescript --output ../frontend/src/types

# Linting
lint:
	cd backend && ruff check . && ruff format --check .
	cd frontend && bun run lint

lint-backend:
	cd backend && ruff check .

lint-frontend:
	cd frontend && bun run lint

# Formatting
format:
	cd backend && ruff format .
	cd frontend && bun run format

format-backend:
	cd backend && ruff format .

format-frontend:
	cd frontend && bun run format

# Testing
test:
	cd backend && pytest
	cd frontend && bun run typecheck

test-backend:
	cd backend && pytest -v

test-frontend:
	cd frontend && bun run typecheck && bun run lint

# Cleanup
clean:
	docker compose down -v
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type d -name "node_modules" -exec rm -rf {} +
	find . -type d -name ".pytest_cache" -exec rm -rf {} +
