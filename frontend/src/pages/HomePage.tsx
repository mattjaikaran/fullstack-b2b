import { Link } from 'react-router-dom'
import { useAuth } from '@/lib/auth'

export default function HomePage() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block">Welcome to</span>
          <span className="block text-primary-600">React Vite Starter</span>
        </h1>
        <p className="mx-auto mt-3 max-w-md text-base text-gray-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
          A modern React starter template with Vite, TailwindCSS, TanStack Query, and TypeScript.
        </p>
        <div className="mx-auto mt-5 max-w-md sm:flex sm:justify-center md:mt-8">
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn-primary">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <div className="rounded-md shadow">
                <Link to="/register" className="btn-primary w-full">
                  Get started
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:ml-3 sm:mt-0">
                <Link to="/login" className="btn-outline w-full">
                  Sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Features section */}
      <div className="mt-20">
        <h2 className="text-center text-3xl font-bold text-gray-900">Features</h2>
        <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-medium text-gray-900">React 18</h3>
            <p className="mt-2 text-gray-500">
              Latest React with concurrent features and improved performance.
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-medium text-gray-900">Vite</h3>
            <p className="mt-2 text-gray-500">
              Lightning fast HMR and optimized production builds.
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-medium text-gray-900">TailwindCSS</h3>
            <p className="mt-2 text-gray-500">
              Utility-first CSS framework for rapid UI development.
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-medium text-gray-900">TanStack Query</h3>
            <p className="mt-2 text-gray-500">
              Powerful data fetching and caching with React Query.
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-medium text-gray-900">TypeScript</h3>
            <p className="mt-2 text-gray-500">
              Full type safety with TypeScript throughout the codebase.
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-medium text-gray-900">React Router</h3>
            <p className="mt-2 text-gray-500">
              Client-side routing with React Router v6.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
