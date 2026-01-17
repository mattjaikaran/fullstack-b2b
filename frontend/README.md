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
- **ESLint + Prettier** - Code linting and formatting
- **Bun** - Fast JavaScript runtime and package manager

## Quick Start

### Prerequisites

- [Bun](https://bun.sh) (recommended) or Node.js 18+

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/react-vite-starter.git myapp
cd myapp
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
bun lint       # Run ESLint
bun format     # Format with Prettier
bun typecheck  # Run TypeScript check
```

## API Integration

The template is configured to work with a Django API backend (like [django-api-starter](https://github.com/yourusername/django-api-starter)).

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

### Adding API Endpoints

Use the `api` instance from `src/lib/api.ts`:

```typescript
import { api } from '@/lib/api'

const fetchUsers = async () => {
  const { data } = await api.get('/users')
  return data
}
```

### TanStack Query

```typescript
import { useQuery } from '@tanstack/react-query'

const { data, isLoading, error } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
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
