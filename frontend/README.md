# React Vite Starter

A modern React starter template with Vite, TailwindCSS, TanStack Query, and TypeScript.

## Features

- **React 18** - Latest React with concurrent features
- **Vite** - Lightning fast HMR and optimized builds
- **TypeScript** - Full type safety
- **TailwindCSS** - Utility-first CSS framework
- **TanStack Query** - Powerful data fetching and caching
- **React Router v6** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Zod** - Schema validation
- **Oxlint + Oxfmt** - Code linting and formatting
- **Bun** - Fast JavaScript runtime and package manager

## Quick Start

### Prerequisites

- [Bun](https://bun.sh) (recommended) or Node.js 18+

### Setup

1. Clone the monorepo and go to the frontend:

```bash
git clone https://github.com/mattjaikaran/fullstack-b2b.git myproject
cd myproject/frontend
```

2. Install dependencies:

```bash
bun install
```

3. Copy environment file:

```bash
cp .env.example .env
```

4. Start development server:

```bash
bun dev
```

Visit http://localhost:5173

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Layout.tsx       # Main layout with navigation
│   └── ProtectedRoute.tsx
├── lib/                 # Utilities and configurations
│   ├── api.ts           # Axios instance and helpers
│   ├── auth.tsx         # Authentication context
│   └── utils.ts         # Utility functions
├── pages/               # Page components
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── DashboardPage.tsx
│   ├── ProfilePage.tsx
│   └── NotFoundPage.tsx
├── types/               # TypeScript type definitions
├── App.tsx              # Main app component
├── main.tsx             # Entry point
└── index.css            # Global styles
```

## Scripts

```bash
bun dev        # Start development server
bun build      # Build for production
bun preview    # Preview production build
bun lint          # Run Oxlint
bun lint:strict   # Run Oxlint with warnings denied
bun lint:fix      # Run Oxlint with auto-fix
bun format        # Format with Oxfmt
bun format:check  # Check formatting with Oxfmt
bun typecheck     # Run TypeScript check
bun api:generate  # Regenerate src/api/generated from backend/docs/openapi/openapi.json
```

`dev`, `build` and `typecheck` regenerate `src/api/generated` first; it is not committed.

## API Integration

The template is configured to work with its paired Django API backend in `backend/` (OpenAPI contract at `backend/docs/openapi/openapi.json`).

### Development Proxy

In development, API requests to `/api/*` are proxied to `http://localhost:8000` (see `vite.config.ts`).

### Production

Set the `VITE_API_URL` environment variable to your API URL:

```env
VITE_API_URL=https://api.example.com
```

## Authentication

The template includes a complete authentication flow:

- Login with email/password
- User registration
- JWT token management with auto-refresh
- Protected routes
- Auth context with `useAuth()` hook

## Styling

Uses TailwindCSS with custom utility classes defined in `src/index.css`:

- `.btn` - Base button styles
- `.btn-primary` - Primary button
- `.btn-secondary` - Secondary button
- `.btn-outline` - Outlined button
- `.input` - Form input styles
- `.label` - Form label styles

## Customization

### Adding New Pages

1. Create a new page component in `src/pages/`
2. Add the route in `src/App.tsx`

### Using the Generated API Client

`src/api/generated/` is generated from the backend OpenAPI schema by `@hey-api/openapi-ts` (config: `openapi-ts.config.ts`). It is gitignored: do not edit it by hand and do not commit it.

```typescript
import { appsUsersControllersMe } from '@/api/generated'

const { data } = await appsUsersControllersMe({ throwOnError: true })
```

The generated client uses the shared `api` instance from `src/lib/api.ts` (via `src/lib/api-client.ts`), so auth headers and token refresh apply. TanStack Query helpers are generated in `src/api/generated/@tanstack/react-query.gen.ts`.

### Regenerating After Backend API Changes

```bash
cd ../backend && .venv/bin/python manage.py export_openapi  # Writes docs/openapi/openapi.json
```

Commit the schema. The client regenerates from it on `bun run dev`, `build` and `typecheck`, or on demand with `bun run api:generate`.

### TanStack Query

```typescript
import { useQuery } from '@tanstack/react-query'
import { appsUsersControllersMe } from '@/api/generated'

const { data, isLoading, error } = useQuery({
  queryKey: ['user'],
  queryFn: async () => (await appsUsersControllersMe({ throwOnError: true })).data,
})
```

## Deployment

### Build

```bash
bun run build
```

The output will be in the `dist/` directory.

### Deploy

Deploy the `dist/` directory to any static hosting:

- Vercel
- Netlify
- Cloudflare Pages
- AWS S3 + CloudFront

## License

MIT
